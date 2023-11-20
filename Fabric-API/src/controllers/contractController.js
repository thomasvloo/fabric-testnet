const express = require("express");
const asyncHandler = require("express-async-handler");
const {
    initLedger,
    getAllAssets,
    createAsset,
    assetExists,
    exportLedgerToCSV,
    //readAsset,
    //updateAsset,
    //transferAsset,
} = require("../scripts/chaincodeFunctions");

const initializeLedger = asyncHandler(async (req, res) => {
    const result = await initLedger();
    res.status(200).json(result);
});

const retrieveAllAssets = asyncHandler(async (req, res) => {
    const result = await getAllAssets();
    res.status(200).json(JSON.parse(result));
});

const saveledger = asyncHandler(async (req, res) => {
    await exportLedgerToCSV();
    res.status(200).send("Ledger saved to ledger.csv");
});

const createAnAsset = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { eventId } = req.body;
    console.log(eventId);
    const result = await createAsset(req.body);
    res.status(200).json(JSON.parse(result));
});

const checkAssetExists = asyncHandler(async (req, res) => {
    const { assetID } = req.body;
    const result = await assetExists(assetID);
    res.status(200).json(JSON.parse(result));
});

// const readAnAsset = asyncHandler(async (req, res) => {
//     const { assetID } = req.body;
//     const result = await readAsset(assetID);
//     res.status(200).json(JSON.parse(result));
// });

// const updateAnAsset = asyncHandler(async (req, res) => {
//     const { assetID, color, size, owner, appraisedValue } = req.body;
//     const result = await updateAsset(
//         assetID,
//         color,
//         size,
//         owner,
//         appraisedValue
//     );
//     res.status(200).json(JSON.parse(result));
// });

// const transferAnAsset = asyncHandler(async (req, res) => {
//     const { assetID, newOwner } = req.body;
//     const result = await transferAsset(assetID, newOwner);
//     res.status(200).json(JSON.parse(result));
// });

module.exports = {
    initializeLedger,
    retrieveAllAssets,
    createAnAsset,
    checkAssetExists,
    saveledger,
    //readAnAsset,
    //updateAnAsset,
    //transferAnAsset,
};
