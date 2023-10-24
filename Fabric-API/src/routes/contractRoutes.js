const express = require("express");

const {
    initializeLedger,
    retrieveAllAssets,
    createAnAsset,
    readAnAsset,
    checkAssetExists,
    updateAnAsset,
    transferAnAsset,
} = require("../controllers/contractController");

const router = express.Router();

router.get("/getAllAssets", retrieveAllAssets);
router.get("/readAsset", readAnAsset);
router.get("/checkAssetExists", checkAssetExists);

router.post("/initLedger", initializeLedger);
router.post("/createAsset", createAnAsset);

router.put("/updateAsset", updateAnAsset);
router.put("/transferAsset", transferAnAsset);

module.exports = router;
