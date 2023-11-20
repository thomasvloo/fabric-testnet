const networkManager = require("./networkManager.js");
const fs = require("fs");

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function initLedger() {
    console.log(
        "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
    );
    await networkManager.contract.submitTransaction("InitLedger");
    console.log("*** Result: committed");
    return "Result Committed, Ledger has been initialized with sample assets.";
}

async function getAllAssets() {
    console.log(
        "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
    );
    const result = await networkManager.contract.evaluateTransaction(
        "GetAllAssets"
    );
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return result.toString();
}

async function createAsset(params) {
    console.log(
        "\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments"
    );
    console.log(params);
    const { eventId } = params;
    console.log(eventId);
    const test = !eventId;
    console.log(test);
    await networkManager.contract.submitTransaction(
        "CreateAsset",
        JSON.stringify(params)
    );
    console.log("*** Result: committed");
    const result = await networkManager.contract.evaluateTransaction(
        "ReadAsset",
        params.eventId
    );
    if (`${result}` !== "") {
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    }
    return result.toString();
}

async function assetExists(assetID) {
    console.log(
        '\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist'
    );
    const result = await networkManager.contract.evaluateTransaction(
        "AssetExists",
        assetID
    );
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return result.toString();
}

function convertToCSV(objArray) {
    const array =
        typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let header = Object.keys(array[0]).join(",") + "\r\n";
    let str = array.reduce((acc, row) => {
        let rowData = Object.values(row).join(",") + "\r\n";
        return acc + rowData;
    }, header);
    return str;
}

function jsonToCSVAndDownload(jsonData, fileName = "./ledger.csv") {
    const csv = convertToCSV(jsonData);
    fs.writeFile(fileName, csv, "utf8", function (err) {
        if (err) {
            console.log(
                "Some error occurred - file either not saved or corrupted file saved.",
                err
            );
        } else {
            console.log("It's saved!");
        }
    });
}

async function exportLedgerToCSV() {
    const result = await networkManager.contract.evaluateTransaction(
        "GetAllAssets"
    );
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    jsonToCSVAndDownload(result.toString());

    return result.toString();
}
// async function readAsset(assetID) {
//     console.log(
//         "\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID"
//     );
//     const result = await networkManager.contract.evaluateTransaction(
//         "ReadAsset",
//         assetID
//     );
//     console.log(`*** Result: ${prettyJSONString(result.toString())}`);
//     return result.toString();
// }

// async function updateAsset(assetID, color, size, owner, appraisedValue) {
//     console.log(`\n--> Submit Transaction: UpdateAsset ${assetID}`);
//     await networkManager.contract.submitTransaction(
//         "UpdateAsset",
//         assetID,
//         color,
//         size,
//         owner,
//         appraisedValue
//     );
//     const result = await networkManager.contract.evaluateTransaction(
//         "ReadAsset",
//         assetID
//     );
//     console.log(`*** Result: ${prettyJSONString(result.toString())}`);
//     return result.toString();
// }

// async function transferAsset(assetID, newOwner) {
//     console.log(
//         `\n--> Submit Transaction: TransferAsset ${assetID}, transfer to new owner of ${newOwner}`
//     );
//     await networkManager.contract.submitTransaction(
//         "TransferAsset",
//         assetID,
//         newOwner
//     );
//     const result = await networkManager.contract.evaluateTransaction(
//         "ReadAsset",
//         assetID
//     );
//     console.log(`*** Result: ${prettyJSONString(result.toString())}`);
//     return result.toString();
// }

module.exports = {
    initLedger,
    getAllAssets,
    createAsset,
    assetExists,
    exportLedgerToCSV,
    //readAsset,
    //updateAsset,
    //transferAsset,
};
