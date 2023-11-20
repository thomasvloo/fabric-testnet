const express = require("express");

const {
    initializeLedger,
    retrieveAllAssets,
    createAnAsset,
    checkAssetExists,
    saveledger,
} = require("../controllers/contractController");

const router = express.Router();

// GET Routes
router.get("/getAllAssets", retrieveAllAssets);
router.get("/checkAssetExists", checkAssetExists);
router.get("/saveLedger", saveledger);

// POST Routes
router.post("/initLedger", initializeLedger);
router.post("/createAsset", createAnAsset);

module.exports = router;
