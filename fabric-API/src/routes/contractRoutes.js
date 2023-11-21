// ********** Imports **********
const express = require("express");

const {
    initializeLedger,
    retrieveAllAssets,
    createAnAsset,
    checkAssetExists,
    saveledger,
} = require("../controllers/contractController");

// ********** Routes **********
const router = express.Router();

// GET Routes
router.get("/getAllAssets", retrieveAllAssets);
router.get("/checkAssetExists", checkAssetExists);
router.get("/saveLedger", saveledger);

// POST Routes
router.post("/initLedger", initializeLedger);
router.post("/createAsset", createAnAsset);

// ********** Exports **********
module.exports = router;
