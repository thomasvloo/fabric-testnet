const networkManager = require("./networkManager.js");

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function initLedger() {
    console.log(
        "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
    );
    const result = await networkManager.contract.submitTransaction(
        "InitLedger"
    );
    console.log("*** Result: committed");
    return prettyJSONString(result.toString());
}

async function getAllAssets() {
    console.log(
        "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
    );
    const result = await networkManager.contract.evaluateTransaction(
        "GetAllAssets"
    );
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return prettyJSONString(result.toString());
}

async function createAsset(assetID, color, size, owner, appraisedValue) {
    console.log(
        "\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments"
    );
    const result = await networkManager.contract.submitTransaction(
        "CreateAsset",
        assetID,
        color,
        size,
        owner,
        appraisedValue
    );
    console.log("*** Result: committed");
    if (`${result}` !== "") {
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    }
    return prettyJSONString(result.toString());
}

async function readAsset(assetID) {
    console.log(
        "\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID"
    );
    const result = await networkManager.contract.evaluateTransaction(
        "ReadAsset",
        assetID
    );
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return prettyJSONString(result.toString());
}

async function assetExists(assetID) {
    console.log(
        '\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist'
    );
    const result = await networkManager.contract.evaluateTransaction(
        "AssetExists",
        "asset1"
    );
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return prettyJSONString(result.toString());
}

async function updateAsset(assetID, color, size, owner, appraisedValue) {
    console.log(
        "\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350"
    );
    const result = await networkManager.contract.submitTransaction(
        "UpdateAsset",
        assetID,
        color,
        size,
        owner,
        appraisedValue
    );
    console.log("*** Result: committed");
    return prettyJSONString(result.toString());
}

async function transferAsset(assetID, newOwner) {
    console.log(
        "\n--> Submit Transaction: TransferAsset asset1, transfer to new owner of Tom"
    );
    const result = await networkManager.contract.submitTransaction(
        "TransferAsset",
        assetID,
        newOwner
    );
    console.log("*** Result: committed");
    return prettyJSONString(result.toString());
}
// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca
// - Use any of the asset-transfer-basic chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "basic". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
    2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
    ******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

   OR

   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-basic/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

module.exports = {
    initLedger,
    getAllAssets,
    createAsset,
    readAsset,
    assetExists,
    updateAsset,
    transferAsset,
};
