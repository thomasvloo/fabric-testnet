const express = require("express");
const asyncHandler = require("express-async-handler");
const {
    initLedger,
    getAllAssets,
    createAsset,
    readAsset,
    assetExists,
    updateAsset,
    transferAsset,
} = require("../scripts/chaincodeFunctions");

const initializeLedger = asyncHandler(async (req, res) => {
    await initLedger();
    res.status(200);
});

const retrieveAllAssets = asyncHandler(async (req, res) => {
    await getAllAssets();
    res.status(200);
});

const createAnAsset = asyncHandler(async (req, res) => {
    const { assetID, color, size, owner, appraisedValue } = req.body;
    await createAsset(assetID, color, size, owner, appraisedValue);
    res.status(200);
});

const readAnAsset = asyncHandler(async (req, res) => {
    const { assetID } = req.body;
    await readAsset(assetID);
    res.status(200);
});

const checkAssetExists = asyncHandler(async (req, res) => {
    const { assetID } = req.body;
    await assetExists(assetID);
    res.status(200);
});

const updateAnAsset = asyncHandler(async (req, res) => {
    const { assetID, color, size, owner, appraisedValue } = req.body;
    await updateAsset(assetID, color, size, owner, appraisedValue);
    res.status(200);
});

const transferAnAsset = asyncHandler(async (req, res) => {
    const { assetID, newOwner } = req.body;
    await transferAsset(assetID, newOwner);
    res.status(200);
});

module.exports = {
    helloworld,
    initializeLedger,
    retrieveAllAssets,
    createAnAsset,
    readAnAsset,
    checkAssetExists,
    updateAnAsset,
    transferAnAsset,
};
