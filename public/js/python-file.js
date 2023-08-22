window.pyCode =`import numpy as np
from collections.abc import Sequence

def noise_ratio(noisy_data: Sequence[float],
            noiseless_data: Sequence[float]) -> float:
    if len(noisy_data) != len(noiseless_data):
        raise ValueError('Noisy and noiseless data length did not match. ')

    print(type(noisy_data))
    print(type(noiseless_data))

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

# also works in native python
# print(noise_ratio([1, 2], [88, 10]))
# print(rmsre_t([1, 2], [88, 10]))`