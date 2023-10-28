const express = require("express");

const {
    initializeLedger,
    retrieveAllAssets,
    createAnAsset,
    readAnAsset,
    checkAssetExists,
    updateAnAsset,
    transferAnAsset,
    saveledger,
} = require("../controllers/contractController");

const router = express.Router();

router.get("/getAllAssets", retrieveAllAssets);
router.get("/readAsset", readAnAsset);
router.get("/checkAssetExists", checkAssetExists);
router.get("/saveLedger", saveledger);

router.post("/initLedger", initializeLedger);
router.post("/createAsset", createAnAsset);

router.put("/updateAsset", updateAnAsset);
router.put("/transferAsset", transferAnAsset);

module.exports = router;
