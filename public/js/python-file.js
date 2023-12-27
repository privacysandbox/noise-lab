window.pyCode =`import numpy as np
from collections.abc import Sequence

import itertools
import math
from typing import Optional
import json

from scipy import optimize

def noise_ratio(noisy_data: Sequence[float],
            noiseless_data: Sequence[float]) -> float:
    if len(noisy_data) != len(noiseless_data):
        raise ValueError('Noisy and noiseless data length did not match. ')

    if not isinstance(noisy_data, list) or not isinstance(
        noiseless_data, list):
        noisy_data = noisy_data.to_py()
        noiseless_data = noiseless_data.to_py()

    if not isinstance(noisy_data, np.ndarray) or not isinstance(
        noiseless_data, np.ndarray):
        noisy_data = np.array(noisy_data)
        noiseless_data = np.array(noiseless_data)

    errors = noisy_data - noiseless_data
    error_ratios = abs(errors)/noiseless_data
    avg_error_ratios = np.average(error_ratios)
    return avg_error_ratios

def rmsre_t(
    noisy_data: Sequence[float],
    noiseless_data: Sequence[float],
    l1_scale: int,
    maximum_threshold: int = 10,
) -> dict[int, tuple[float, Sequence[float]]]:

    if len(noisy_data) != len(noiseless_data):
        raise ValueError('Noisy and noiseless data length did not match.')

    if not isinstance(noisy_data, list) or not isinstance(
        noiseless_data, list):
        noisy_data = noisy_data.to_py()
        noiseless_data = noiseless_data.to_py()

    if not isinstance(noisy_data, np.ndarray) or not isinstance(
        noiseless_data, np.ndarray):
        noisy_data = np.array(noisy_data)
        noiseless_data = np.array(noiseless_data)

    errors = noisy_data - noiseless_data
    result = dict()
    # TODO(aksu): verify if [1,10] range is sufficient.
    for t in range(1, maximum_threshold + 1):
        percentage_errors = errors / np.maximum(noiseless_data, l1_scale * t)
        squared_percentage_errors = percentage_errors**2
        mean_squared_percentage_error = np.average(squared_percentage_errors)
        root_mean_squared_percentage_error: float = np.sqrt(
            mean_squared_percentage_error)
        root_squared_percentage_errors = np.sqrt(squared_percentage_errors).tolist()
        result[t] = (root_mean_squared_percentage_error,
                    root_squared_percentage_errors)
    return result

# power-law as power_law(x) = a*x^b for param a,b constants.
def power_law(x: int, a: float, b: float) -> float:
    return a*np.power(x, b)
    
    
def _get_a_for_key_cnt(b: float,
                       total_keys: int,
                       num_slices: Optional[int] = None) -> float:
    if not num_slices:
      num_slices = total_keys
    # range(1, 'num_slices')
    x = np.arange(1, num_slices + 1)
    
    def f(a):
      return sum(np.round(power_law(x, a, b))) - total_keys
    
    root = optimize.root_scalar(f, bracket=[0, 1e6])
    return root.root
    
    
def generate_slice_distribution_for_impressions(
    param_b: float, num_slices: int
) -> dict[int, int]:
    # first compute param a for given param b and num_slices
    param_a = _get_a_for_key_cnt(param_b, num_slices)
    
    slice_total = 0
    result_dist = {}
    for slice_size in range(1, num_slices+1):
      slice_cnt = round(power_law(slice_size, param_a, param_b))
      # makes sure total does not exceeds number_of_slices
      slice_cnt = min(slice_cnt, num_slices-slice_total)
      slice_total += slice_cnt
      result_dist[slice_size] = slice_cnt
    return result_dist
    
    
def get_conversion_distribution(
        param_b: float,
        num_slices: int,
        total_conversions: int) -> list[int]: 
    param_a_computed = _get_a_for_key_cnt(param_b, total_conversions, num_slices)
    x = np.arange(1, num_slices + 1)
    res = np.round(power_law(x, param_a_computed, param_b)).astype(int)
    remaining = total_conversions - sum(res)
    res[0] += remaining
    return res
    
    
def get_b_param_from_percentiles(
        slice_1_rate: float, slice_2_rate: float
) -> float:
    return np.log2(slice_2_rate / slice_1_rate)
    
    
def generate_slice_distribution_with_conversions(
        param_b: float,
        impression_dist: dict[int, int],
        average_conversion_per_impression: float,
        conversion_key_cardinality: int,
        max_mpc: int = 10,
) -> dict[int, dict[int, int]]:
    # final_keys_freq_with_mpc holds { mpc -> { slice_size -> freq } }
    # final_keys_freq_with_mpc[2] = {3:4} means
    # at mpc=2 there exist 4 slices with slice_size = 3
    final_keys_freq_with_mpc: dict[int, dict[int, int]] = {}
    # initialize distribution for each mpc value. 0 is used for mpc=inf
    for mpc in range(0, max_mpc + 1):
        final_keys_freq_with_mpc[mpc] = {}
    
    # each impression key would make that many attributed keys
    for key_imp_cnt, freq in impression_dist.items():
        # process each key
        for _ in range(freq):
            # this impression_key has {key_imp_cnt} many impressions
            # step 2.a
            # this slice would get sum(poisson(lambda, key_imp_cnt)) conversion
            # before mpc limits applied.
            cur_contributions = np.random.poisson(
                lam=average_conversion_per_impression, size=key_imp_cnt
            )
            # consider each mpc value and infinity.
            for mpc in itertools.chain(range(1, max_mpc + 1), [np.inf]):
                # step 2.b
                cur_slice_conversion_cnt = int(sum(np.minimum(cur_contributions, mpc)))
                # Step 2.c
                conv_dist = get_conversion_distribution(
                    param_b=param_b,
                    num_slices=conversion_key_cardinality,
                    total_conversions=cur_slice_conversion_cnt,
                )
                # index 0 holds mpc=infinity case
                if math.isinf(mpc):
                    cur_keys_freq = final_keys_freq_with_mpc[0]
                else:
                    cur_keys_freq = final_keys_freq_with_mpc[mpc]
                # here slices assigned conversions. conv_dist = [143, 51] implies
                # a slice gets 143 many conversion, another one get 51 conversions.
                # frequancy of slice_size 143 and 51 needs to be incremented.
                # update frequancy for slices
                for slice_size in conv_dist:
                    cur_keys_freq[slice_size] = cur_keys_freq.get(slice_size, 0) + 1
    
    return final_keys_freq_with_mpc
    
    
def _key_to_str(key: list[int]) -> str:
    return ','.join(map(str, key))
    
    
def slice_distibution_to_dataset(
        dist: dict[int, int],
        impression_side_dimensions: list[int],
        conversion_side_dimensions: list[int],
) -> dict[str, int]:
    ranges = []
    for key in impression_side_dimensions:
        ranges.append(range(key))
    for key in conversion_side_dimensions:
        ranges.append(range(key))
    all_keys = itertools.product(*ranges)
    # dist has keys=#conversion, values=frequancy
    conversions_numbers = list(dist.keys())
    conversions_numbers.sort(reverse=True)
    cur_cnt_index = 0
    slices = {}
    for key in all_keys:
        cur_conv: int = conversions_numbers[cur_cnt_index]
        while dist[cur_conv] == 0:  # frequancy is 0
            # this conversion number is used completely. switch to another one.
            cur_cnt_index += 1
            cur_conv = conversions_numbers[cur_cnt_index]
        dist[cur_conv] -= 1
        slice_key = _key_to_str(key)
        slices[slice_key] = cur_conv
    return slices
    
    
def generate_dataset(
    slice_1_rate: float,
    slice_2_rate: float,
    average_conversion_per_impression: int,
    impression_side_dimensions: list[int],
    conversion_side_dimensions: list[int],
    input_mpc: int,
    maximum_mpc: int = 20,
) -> dict[int, dict[str, int]]:
    if not isinstance(conversion_side_dimensions, list) or not isinstance(
        impression_side_dimensions, list):
        conversion_side_dimensions = conversion_side_dimensions.to_py()
        impression_side_dimensions = impression_side_dimensions.to_py()
    param_b = get_b_param_from_percentiles(slice_1_rate, slice_2_rate)
    num_impression_keys = np.prod(np.array(impression_side_dimensions))
    num_conversion_keys = np.prod(conversion_side_dimensions)
    impression_dist = generate_slice_distribution_for_impressions(
        param_b, num_impression_keys
    )
    final_keys_freq = generate_slice_distribution_with_conversions(
        param_b,
        impression_dist,
        average_conversion_per_impression,
        conversion_key_cardinality=num_conversion_keys,
        max_mpc=maximum_mpc,
    )
    dataset = {}
    for mpc in final_keys_freq:
        dataset[mpc] = slice_distibution_to_dataset(
            final_keys_freq[mpc],
            impression_side_dimensions,
            conversion_side_dimensions,
        )
    
    final_result = dataset[input_mpc]
    for keys in final_result:
        final_result[keys] = str(final_result[keys])
    return json.dumps(final_result)


def generate_dataset_original(
    slice_1_rate: float,
    slice_2_rate: float,
    average_conversion_per_impression: int,
    impression_side_dimensions: list[int],
    conversion_side_dimensions: list[int],
    maximum_mpc: int = 20,
) -> dict[int, dict[str, int]]:
    param_b = get_b_param_from_percentiles(slice_1_rate, slice_2_rate)
    num_impression_keys = np.prod(impression_side_dimensions)
    num_conversion_keys = np.prod(conversion_side_dimensions)
    impression_dist = generate_slice_distribution_for_impressions(
        param_b, num_impression_keys
    )
    final_keys_freq = generate_slice_distribution_with_conversions(
        param_b,
        impression_dist,
        average_conversion_per_impression,
        conversion_key_cardinality=num_conversion_keys,
        max_mpc=maximum_mpc,
    )
    dataset = {}
    for mpc in final_keys_freq:
        dataset[mpc] = slice_distibution_to_dataset(
            final_keys_freq[mpc],
            impression_side_dimensions,
            conversion_side_dimensions,
        )
    return dataset
    
def generate_counts_and_values_dataset(
    slice_1_rate: float,
    slice_2_rate: float,
    average_conversion_per_impression: int,
    impression_side_dimensions: list[int],
    conversion_side_dimensions: list[int],
    value_mean: float,
    value_mode: float,
    input_mpc: int,
    maximum_mpc: int = 20,
) -> dict[str, str]:
    if not isinstance(conversion_side_dimensions, list) or not isinstance(
        impression_side_dimensions, list):
        conversion_side_dimensions = conversion_side_dimensions.to_py()
        impression_side_dimensions = impression_side_dimensions.to_py()
    count_dataset = generate_dataset_original(
        slice_1_rate,
        slice_2_rate,
        average_conversion_per_impression,
        impression_side_dimensions,
        conversion_side_dimensions,
        maximum_mpc,
    )
    
    # compute mu and sigma from mean and mode values.
    # details: go/noise-lab-dataset-value-inputs
    def get_lognormal_mu_sigma(value_mean, value_mode):
        value_mu = (2 * np.log(value_mean) + np.log(value_mode)) / 3
        value_sigma = np.sqrt(value_mu - np.log(value_mode))
        return value_mu, value_sigma
    
    value_mu, value_sigma = get_lognormal_mu_sigma(value_mean, value_mode)
    dataset = {}
    for mpc in count_dataset:
        dataset[mpc] = {}
        for attributed_key, conversion_count in count_dataset[mpc].items():
            dataset[mpc][attributed_key] = str(round(np.sum(
                    np.random.lognormal(
                        mean=value_mu, sigma=value_sigma, size=conversion_count
                    )
                ))
             )
    res = dataset[input_mpc]
    return json.dumps(res)`
