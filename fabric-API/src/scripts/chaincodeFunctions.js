// ********** Imports **********
const networkManager = require("./networkManager.js");
const fs = require("fs");

// ********** Functions **********

/**
 * Converts a JSON string to a formatted (pretty) JSON string.
 * @param {string} inputString - The JSON string to format.
 * @returns {string} A formatted JSON string.
 */
function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

/**
 * Initializes the ledger with a set of sample assets.
 * This function submits a transaction to the blockchain network to initialize the ledger.
 * @returns {Promise<string>} A promise that resolves to a confirmation message.
 */
async function initLedger() {
    console.log(
        "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
    );
    await networkManager.contract.submitTransaction("InitLedger");
    console.log("*** Result: committed");
    return "Result Committed, Ledger has been initialized with sample assets.";
}

/**
 * Retrieves all assets from the ledger.
 * This function evaluates a transaction to fetch all assets currently stored in the ledger.
 * @returns {Promise<string>} A promise that resolves to a string representing all assets.
 */
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

/**
 * Creates a new asset in the ledger.
 * Submits a transaction to create an asset with the provided parameters.
 * @param {Object} params - Asset details for the new asset.
 * @returns {Promise<string>} A promise that resolves to the created asset details.
 */
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
    const result = `event ${eventId} successfully committed.`;
    return result.toString();
}

/**
 * Checks if an asset exists in the ledger.
 * Evaluates a transaction to check the existence of an asset based on the given assetID.
 * @param {string} assetID - The ID of the asset to check.
 * @returns {Promise<string>} A promise that resolves to "true" if the asset exists, otherwise "false".
 */
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

/**
 * Converts a JSON array to a CSV string.
 * @param {Object[]} objArray - Array of objects to be converted into CSV.
 * @returns {string} CSV string representation of the input JSON array.
 */
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

/**
 * Converts JSON data to CSV and writes it to a file.
 * @param {string} jsonData - JSON string to be converted to CSV.
 * @param {string} [fileName="./ledger.csv"] - Name of the file to save the CSV data.
 */
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

/**
 * Exports the ledger data to a CSV file.
 * This function fetches all assets from the ledger and converts them to CSV format.
 * @returns {Promise<string>} A promise that resolves to the fetched ledger data in string format.
 */
async function exportLedgerToCSV() {
    const result = await networkManager.contract.evaluateTransaction(
        "GetAllAssets"
    );
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    jsonToCSVAndDownload(result.toString());

    return result.toString();
}

// ********** Exports **********
module.exports = {
    initLedger,
    getAllAssets,
    createAsset,
    assetExists,
    exportLedgerToCSV,
};
