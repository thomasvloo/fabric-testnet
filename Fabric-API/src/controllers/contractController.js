// ********** Imports **********
const express = require("express");
const asyncHandler = require("express-async-handler");
const {
    initLedger,
    getAllAssets,
    createAsset,
    assetExists,
    exportLedgerToCSV,
} = require("../scripts/chaincodeFunctions");

// ********** Functions **********
/**
 * Request Type: POST
 * Request Path: /contract/initLedger
 * Request parameters: -
 * Description: Initializes the ledger with some pre-prepared log events.
 */
const initializeLedger = asyncHandler(async (req, res) => {
    const result = await initLedger();
    res.status(200).json(result);
});

/**
 * Request Type: GET
 * Request Path: /contract/getAllAssets
 * Request parameters: -
 * Description: Fetches and returns all logs currently in the ledger.
 */
const retrieveAllAssets = asyncHandler(async (req, res) => {
    const result = await getAllAssets();
    res.status(200).json(JSON.parse(result));
});

/**
 * Request Type: POST
 * Request Path: /contract/createAsset
 * Request parameters: The log event to be stored on-chain in the request body
 * Description: Takes the given log attributes and stores the log event on-chain.
 */
const createAnAsset = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { eventId } = req.body;
    console.log(eventId);
    const result = await createAsset(req.body);
    res.status(200).json(JSON.parse(result));
});

/**
 * Request Type: GET
 * Request Path: /contract/checkAssetExists
 * Request parameters: the eventId of the log event
 * Description: Returns true or false based on whether an event log exists with the given ID on-chain.
 */
const checkAssetExists = asyncHandler(async (req, res) => {
    const { assetID } = req.body;
    const result = await assetExists(assetID);
    res.status(200).json(JSON.parse(result));
});

/**
 * Request Type: GET
 * Request Path: contract/saveLedger
 * Request parameters: -
 * Description: Fetches the entire ledger, formats it, and saves it as a csv file on the machine hosting the api
 */
const saveledger = asyncHandler(async (req, res) => {
    await exportLedgerToCSV();
    res.status(200).send("Ledger saved to ledger.csv");
});

// ********** Exports **********
module.exports = {
    initializeLedger,
    retrieveAllAssets,
    createAnAsset,
    checkAssetExists,
    saveledger,
};
