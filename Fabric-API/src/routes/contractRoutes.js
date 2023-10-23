const express = require("express");

const { helloworld } = require("../controllers/contractController");
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

router.get("/helloworld", helloworld);
router.post("/initLedger", initializeLedger);
router.get("/getAllAssets", retrieveAllAssets);
router.get("/readAsset", readAnAsset);
router.get("/checkAssetExists", checkAssetExists);
router.post("/createAsset", createAnAsset);
router.post("/updateAsset", updateAnAsset);
router.post("transferAsset", transferAnAsset);

module.exports = router;
