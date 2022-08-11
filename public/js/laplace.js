import laplace from '@stdlib/random-base-laplace'

import {
    clearDataDisplay,
    displayNoise,
    displayContributionBudget,
    displayEpsilon,
    displayMaxPurchaseAmount,
} from './dom.js'

import { CONTRIBUTION_BUDGET } from './consts.js'

// global variables

// number of keys
var noKeys = 0
//dataset generated at each time
var dataset
// metrics used for dataset
var metrics
// max amount value
var amt = 2048
//epsilon
var eps = 10
// scaling factor for purchase amount
var scaleAmt
//scaling factor for purchase count
var scaleCnt
// budget per metric
var budgetPM
// laplace noise generated
var l
// Number of keys used per (sub)dataset
var keys
// all sets generated
var dss = []
// key values
var keyVals = []
// table id
var tableNo = 0
// max count based on frequency
var maxCnt = 0

initialize()

function initialize() {
    displayContributionBudget(CONTRIBUTION_BUDGET)
    displayEpsilon(eps)
    displayMaxPurchaseAmount(amt)
}

// function to generate the noise
export function generateLaplace() {
    // collect input params - epsilon, contribution budget, max murchase amount
    eps = document.getElementById('eps').value
    amt = document.getElementById('amount').value
    console.log(
        'laplace function params test:' +
            CONTRIBUTION_BUDGET +
            ',' +
            eps +
            ',' +
            amt
    )

    // calculate b
    var b = Math.floor(CONTRIBUTION_BUDGET / eps)
    // generate noise with Laplace function - mu=0
    l = Math.floor(laplace(0, b))

    // display calculated noise
    // document.getElementById("laplace").innerHTML += " " + l;
    displayNoise(l)

    console.log('laplace: ' + l)
}

// add input elements for the no of keys requested
export function parseKeys() {
    // get no of keys requested
    noKeys = document.getElementById('keys').value
    console.log('Keys: ' + noKeys)

    // generate input element for each key
    var tbody = ''

    for (var i = 1; i <= noKeys; i++) {
        tbody += '<h4> Add key ' + i + ' size: </h4>'
        tbody += '<input type = "text" id ="key' + i + '"><br>'
    }

    // add the elements to the page
    document.getElementById('wrapper').innerHTML = tbody
    clearDataDisplay()
}

// generate dataset
export function genKeyComb(params) {
    // calculate macCnt
    maxCnt = calculateMax()

    // declare array containing possible combinations for keys
    var r = []

    // logic for generating one dataset with all keys - string parameter 'all' is used
    if (params === 'all') {
        console.log('noKeys in genKeyComb' + noKeys)
        // get the length of each key
        for (var j = 1; j <= noKeys; j++) {
            var id = 'key' + j
            var len = document.getElementById(id).value
            console.log('length to be added to keyVals ' + len)
            keyVals.push(len)
            console.log('keyvals:' + keyVals)
            console.log(document.getElementById(id).value)
            // build array of numbers from 0 to key length-1
            var arr = []
            for (var x = 0; x < len; x++) {
                arr.push(x)
            }
            console.log(arr)
            // add array as item to main array
            r.push(arr)
        }

        // when using all keys no of metrics is 2
        metrics = 2
        // no of keys per dataset is equal to total no of keys
        keys = noKeys
        //generate dataset with the given keys
        generateDS(r)
    }
    // multiple key subsets required
    else {
        // get no of sub-sets
        var noSubKeys = document.getElementById('noSubKeys').value
        // get keys required for each subset
        for (var i = 1; i <= noSubKeys; i++) {
            // array to store arrays of keys per sub-set
            var itm = []
            // array to store each sub-set
            var sk = []
            // get input data per subKey set + split + convert to Number
            sk = document
                .getElementById('subKey' + i)
                .value.replace(/\s/g, '')
                .split(',')
                .map(Number)
            console.log('sk' + i)
            console.log(sk)

            // keys required per dataset
            keys = sk.length

            // get each key from sub-set
            for (var j = 0; j < sk.length; j++) {
                console.log('sk[j] ' + j + ':' + sk[j - 1])
                var id = 'key' + sk[j]
                var len = document.getElementById(id).value
                console.log(len)
                var arr = []
                // generate array from 0 to key max -1
                for (var x = 0; x < len; x++) {
                    arr.push(x)
                }
                console.log('arguments added')
                console.log(arr)
                // add key possible values array to array storing all possible values per key
                itm.push(arr)
            }
            // add every set to the main array with all possible combinations
            r.push(itm)
            console.log("here's r:")
            console.log(r)
        }
        // when multiple subsets - metrics is multiplied by no of subsets
        metrics = 2 * r.length

        // generate dataset for each subset of keys
        r.forEach(generateDS)
        document.getElementById('comp').hidden = false
    }
}

// generate dataset
function generateDS(item, index, arr) {
    console.log("here's the index:" + index)
    // clear up working dataset
    dataset = []
    // first add key combination for the requested set
    dataset = cartesian(...item)
    console.log('ds after cartesian')
    console.log(dataset)
    // apply scaling per set
    var skId = index * 1 + 1
    console.log('skId: ' + skId)
    scaling(metrics, skId)
    dss.push(dataset)
}

// generate all possible key values combinations
function cartesian(...args) {
    console.log('cartesian input:')
    console.log(args)
    var r = [],
        max = args.length - 1
    function helper(arr, i) {
        for (var j = 0, l = args[i].length; j < l; j++) {
            var a = arr.slice(0) // clone arr
            a.push(args[i][j])
            if (i == max) r.push(a)
            else helper(a, i + 1)
        }
    }
    helper([], 0)
    console.log('datatset')
    console.log(r)
    // return combinations
    return r
}

// apply scaling and generate random data
export function scaling(metrics, skId) {
    // calculate budget per metric
    budgetPM = Math.floor(CONTRIBUTION_BUDGET / metrics)

    // calculate scaling factors per Amount and Count
    scaleAmt = Math.floor(budgetPM / amt)
    scaleCnt = budgetPM

    if (isNaN(skId)) {
        // generate random purchase count for each dataset row
        dataset.forEach(generateRandP)
        //// generate rando purchase count for each dataset row
        dataset.forEach(generateRandA)
    } else {
        var sKeys = document
            .getElementById('subKey' + skId)
            .value.replace(/\s/g, '')
            .split(',')
            .map(Number)
        console.log('dataset before calculation: ')
        console.log(dataset)
        var mainDs = dss[0]
        console.log('mainDS:')
        console.log(mainDs)

        // HERE!!!!!
        // TURN THIS IN A FOREACH SO YOU CAN APPLY GENERATEVALUE()
        console.log('sKeys: ' + sKeys)
        for (var i = 0; i < dataset.length; i++) {
            calculateSums(sKeys, dataset[i], mainDs)
            generateVal(i, sKeys.length, scaleCnt)
            generateVal(i, dataset[i].length - 1, scaleAmt)
        }
    }
    generateTable(dataset)
    tableNo = tableNo * 1 + 1
    // display used parameters
    displayParams()
}

// function to display split key input
export function splitKeys() {
    document.getElementById('splitKeys').hidden = false
}

// function  to enable subkeys config
export function configSubKeys() {
    console.log('in configSubKeys:' + noSubKeys)
    // create body of items to be added for config
    var tbody = ''
    // get number of sub keys
    var noSubKeys = document.getElementById('noSubKeys').value
    // make sub keys div visible
    document.getElementById('splits').hidden = false

    console.log(noSubKeys)

    // generate input element for each subkey
    for (var i = 1; i <= noSubKeys; i++) {
        tbody +=
            '<h4> Add sub key ' +
            i +
            ' key components, separated by comma ",": </h4>'
        tbody += '<input type = "text" id ="subKey' + i + '"><br>'
    }
    // add imput elements to document
    document.getElementById('splits').innerHTML = tbody
}

export function compNoise() {
    var firstKey = parseInt(document.getElementById('firstkey').value)
    var firstValue = parseInt(document.getElementById('firstvalue').value)
    var secondKey = parseInt(document.getElementById('secondkey').value)
    var secondValue = parseInt(document.getElementById('secondvalue').value)

    var currentDs = dss[0]
    var currSum = 0
    currentDs.forEach((element) => {
        if (element[firstKey - 1] == firstValue) {
            if (element[secondKey - 1] == secondValue) {
                currSum += element[5 + keyVals.length - 1]
            }
        }
    })

    document.getElementById('cumulated').hidden = false
    document.getElementById('cumulated').innerHTML += ' ' + currSum
}

// generate sum count and value
function calculateSums(sk, input, mainDs) {
    var sumCnt = 0
    var sumVal = 0
    var check

    for (var i = 0; i < mainDs.length; i++) {
        check = true

        for (var j = 0; j < sk.length && check; j++) {
            if (mainDs[i][sk[j] - 1] != input[j]) {
                check = false
                break
            }
        }
        if (check === true) {
            sumCnt += mainDs[i][noKeys]
            sumVal += mainDs[i][noKeys * 1 + 5]
        }
    }
    input[sk.length] = sumCnt
    console.log('sumCnt:' + sumCnt)
    input[sk.length * 1 + 5] = sumVal
    return input
}
// generate random purchase count
function generateRandP(value, index, array) {
    // max value hardcoded
    //var max = 20;

    var max = maxCnt
    var min = 0
    dataset[index][dataset[index].length] =
        Math.floor(Math.random() * (max - min + 1)) + min

    // generate random int between 0 and 20 (hardcoded) with scaling factor for count
    generateVal(index, dataset[index].length - 1, scaleCnt)
}

// function to calculate count from main full key ds
function calculateCnt(value, index, array) {
    console.log('index in calculateCnt: ' + (parseInt(index) + 1))
    var currCnt = 0
    var sKeys = document
        .getElementById('subKey' + (parseInt(index) + 1))
        .value.replace(/\s/g, '')
        .split(',')
        .map(Number)
    console.log('sKeys: ' + sKeys)
    dss[0].forEach((element) => {})
}
// generate random amount
function generateRandA(value, index, array) {
    // agg purchase amt = a random number between purchase count (aka per purchase amount is 1) and purchase count * max amount;

    // define max amount as max amount * purchase count
    var max = dataset[index][noKeys] * amt
    // consider min amount is 1 so the minimum amount is equal to purchase count
    var min = dataset[index][noKeys]

    dataset[index][dataset[index].length] =
        Math.floor(Math.random() * (max - min + 1)) + min

    // generate random value between min and max with scaling factor for amount
    generateVal(index, dataset[index].length - 1, scaleAmt)
}

function calculateMax() {
    // max value from parameters
    var freq = document.getElementById('frequency').value
    console.log('frequency:')
    console.log(freq)
    var daily = document.getElementById('daily').value
    console.log('daily:')
    console.log(daily)
    var factor

    switch (freq) {
        case 'h':
            factor = 1 / 24
            break
        case 'd':
            factor = 1
            break
        case 'w':
            factor = 7
            break
        case 'm':
            factor = 30
            break
    }

    console.log(factor)
    var max = daily * 1 * factor
    console.log('max:')
    console.log(max)

    return max
}
//generate random values

function generateVal(index, ind, scale) {
    // generate random value
    // dataset[index][ind] = Math.floor(Math.random() * (max - min + 1)) + min;

    // calculate scaled
    dataset[index][ind * 1 + 1] = dataset[index][ind] * scale
    //
    console.log('dataset[index][ind] * scale : ' + dataset[index][ind] * scale)
    // scaled and noised
    dataset[index][ind * 1 + 2] = dataset[index][ind * 1 + 1] + l

    // descaled
    dataset[index][ind * 1 + 3] = dataset[index][ind * 1 + 2] / scale

    // noise%
    var val =
        (dataset[index][ind * 1 + 3] - dataset[index][ind * 1]) /
        dataset[index][ind * 1]
    if (isFinite(val)) dataset[index][ind * 1 + 4] = val
    else dataset[index][ind * 1 + 4] = 0
}

// build HTML table data from an array (one or two dimensional)
function generateTable(data) {
    var tableArr = data
    //create a Table Object
    var tid = 'tid' + tableNo
    let table = document.createElement('table')
    table.setAttribute('id', tid)

    // generate header row:
    var header = []
    for (var i = 1; i <= keys; i++) {
        header.push('Key ' + i)
    }
    header.push('Purchase count after one month aggregated')
    header.push('Purchase count - scaled')
    header.push('Final count in summary scaled and noised')
    header.push('Descaled purchase count')
    header.push('Noise %')
    header.push('Purchase value after one month agg')
    header.push('Purchase value - scaled')
    header.push('Final value in summary scaled and noised')
    header.push('Descaled purchase value')
    header.push('Noise %')

    populateRow(header, table)

    //iterate over every array(row) within tableArr
    for (let row of tableArr) {
        //Insert a new row element into the table element

        populateRow(row, table)
    }

    let downloadButton = document.createElement('button')
    downloadButton.innerHTML = 'Download table'
    //downloadButton.onclick = download_table_as_csv;
    downloadButton.setAttribute(
        'onClick',
        "download_table_as_csv('" + tid + "')"
    )
    //append the compiled table to the DOM

    var tablesDiv = document.getElementById('tables')

    tablesDiv.appendChild(table)
    tablesDiv.appendChild(downloadButton)
}

// populate table row with values from an array
function populateRow(row, table) {
    //create new row
    table.insertRow()
    for (let cell of row) {
        //While iterating over the index(cell)
        //insert a cell into the table element
        let newCell = table.rows[table.rows.length - 1].insertCell()
        //add text to the created cell element
        newCell.textContent = cell
    }
}

// // enable export dataset to csv
// export function tableToCSV() {

//     // variable to store the final csv data
//     var csv_data = [];

//     // get each row data
//     var rows = document.getElementsByTagName('tr');
//     for (var i = 0; i < rows.length; i++) {

//         // get each column data
//         var cols = rows[i].querySelectorAll('td,th');

//         // stores each csv row data
//         var csvrow = [];
//         for (var j = 0; j < cols.length; j++) {

//             // get the text data of each cell
//             // of a row and push it to csvrow
//             csvrow.push(cols[j].innerHTML);
//         }

//         // combine each column value with comma
//         csv_data.push(csvrow.join(","));
//     }

//     // combine each row data with new line character
//     csv_data = csv_data.join('\n');

//     // call this function to download csv file
//     downloadCSVFile(csv_data);

// }

// // function to download CSV file
// function downloadCSVFile(csv_data) {

//     // Create CSV file object and feed
//     // our csv_data into it
//     var CSVFile = new Blob([csv_data], {
//         type: "text/csv"
//     });

//     // Create to temporary link to initiate
//     // download process
//     var temp_link = document.createElement('a');

//     // Download csv file
//     temp_link.download = "GfG.csv";
//     var url = window.URL.createObjectURL(CSVFile);
//     temp_link.href = url;

//     // This link should not be displayed
//     temp_link.style.display = "none";
//     document.body.appendChild(temp_link);

//     // Automatically click the link to
//     // trigger download
//     temp_link.click();
//     document.body.removeChild(temp_link);
// }

function download_table_as_csv(table_id, separator = ',') {
    // Select rows from table_id
    //var table_id = "tid"+tableNo;
    console.log('tableNo:')
    console.log(table_id)
    var rows = document.querySelectorAll('table#' + table_id + ' tr')

    //var rows = document.querySelectorAll('#' + table_id + ' tr');
    // Construct csv
    var csv = []
    for (var i = 0; i < rows.length; i++) {
        var row = [],
            cols = rows[i].querySelectorAll('td, th')
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText
                .replace(/(\r\n|\n|\r)/gm, '')
                .replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote
            data = data.replace(/"/g, '""')
            // Push escaped string
            row.push('"' + data + '"')
        }
        csv.push(row.join(separator))
    }
    var csv_string = csv.join('\n')
    // Download it
    var filename =
        'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv'
    var link = document.createElement('a')
    link.style.display = 'none'
    link.setAttribute('target', '_blank')
    link.setAttribute(
        'href',
        'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string)
    )
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// function to display all parameters used for the dataset generation
function displayParams() {
    document.getElementById('noMetrics').innerHTML += metrics
    document.getElementById('perMetricBudget').innerHTML += ' ' + budgetPM
    document.getElementById('scaleCnt').innerHTML += ' ' + scaleCnt
    document.getElementById('scaleAmt').innerHTML += ' ' + scaleAmt
}

// declare functions for use outside module
window.laplace = generateLaplace
window.parseKeys = parseKeys
window.genKeyComb = genKeyComb
//window.tableToCSV = tableToCSV;
window.splitKeys = splitKeys
window.configSubKeys = configSubKeys
window.compNoise = compNoise
window.download_table_as_csv = download_table_as_csv
window.clearDataDisplay = clearDataDisplay
