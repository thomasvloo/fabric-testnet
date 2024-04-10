# Fabric - testnet

A NodeJs & Express backend server to interact with a Hyperledger Fabric test network. This project was created as part of a Master's Thesis at the Technical University of Munich.

**NOTE:** This implementation makes use of the Hyperledger Fabric test network, for an in depth look into this test network, please refer to the official [documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.5/test_network.html). A large portion of the contents of the test network were removed as they were not deemed necessary for the purpose of this thesis.

## Prerequisite software

- Git
- cURL
- Docker
- Hyperledger Fabric

## Install Fabric Docker Container images & Binaries

run the following command to install the Hyperledger Fabric Docker container images and binaries:

`./install-fabric.sh docker binary`

## Start up the Fabric test net

Open a terminal and cd into the fabric-samples/test-network directory:

`cd fabric-samples/test-network`

Start the two organization test network, setup with 2 peers, an ordering service, and 2 certificate authorities:

`./network.sh up createChannel -ca`

The following deploy command will package, install, approve, and commit the javascript chaincode, all the actions it takes to deploy a chaincode to a channel:

`./network.sh deployCC -ccn logger -ccp ../../fabric-API/src/chaincode/log-chaincode-javascript/ -ccl javascript`

To stop the network and cleanup run:

`./network.sh down`

## Start the NodeJs & Express Server

Once the Hyperledger Fabric test network is up and running, open a new terminal and cd into the fabric-API folder

`cd fabric-API`

Enter the following command to install the necessary dependencies using Yarn package manager:

`yarn`

Enter the following command to start the server (port 3000)

`yarn start`

To stop the server press `CTRL+C`

## Endpoints Overview

### Initialize Ledger

- **Endpoint**: `/contract/initLedger`
- **Method**: `POST`
- **Description**: Initializes the ledger with predefined assets. This is typically performed once to prepare the ledger for transactions.

### Create Asset

- **Endpoint**: `/contract/createAsset`
- **Method**: `POST`
- **Description**: Creates a new asset and adds it to the ledger. The request body must include the asset details in JSON format.

### Get All Assets

- **Endpoint**: `/contract/getAllAssets`
- **Method**: `GET`
- **Description**: Retrieves a list of all assets currently stored in the ledger. Returns the assets in JSON format.

### Get Number Of Assets

- **Endpoint**: `/contract/getNumberOfAssets`
- **Method**: `GET`
- **Description**: Returns the total number of assets recorded in the ledger.

### Check Asset Exists

- **Endpoint**: `/contract/checkAssetExists`
- **Method**: `GET`
- **Description**: Checks if an asset exists in the ledger based on the provided `assetID`. Returns `true` or `false`.

### Save Ledger to CSV

- **Endpoint**: `/contract/saveLedger`
- **Method**: `GET`
- **Description**: Fetches the entire ledger's content, formats it, and saves it as a CSV file on the host machine.

## Additional Notes

- The API uses standard HTTP response codes to indicate the success or failure of requests.
- Error handling is implemented globally to ensure consistent error responses across all endpoints.
- For `POST` requests, ensure the `Content-Type` header is set to `application/json` and the body contains valid JSON corresponding to the asset schema expected by the chaincode.
- When the server is first initiated, a "wallet" folder is created, containing the cryptographic material for the sample users created to authenticate the connection to the test network the application. This "wallet" folder (`Fabric/fabric-API/src/services/wallet/`) must be deleted when the network is shut down and cleaned using `./network.sh down`, before being able to start the server again.

## Project Structure

```plaintext
Fabric/
└── fabric-API/
    ├── node_modules/ - Contains all the npm packages and dependencies.
    ├── src/
    │   ├── chaincode/
    │   │   └── log-chaincode-javascript/ - Contains the chaincode for logging events on the blockchain.
    │   ├── controllers/
    │   │   └── contractController.js - Manages the application logic and blockchain interaction.
    │   ├── middleware/
    │   │   └── errorMiddleware.js - Handles errors and exceptions within the API.
    │   ├── routes/
    │   │   └── contractRoutes.js - Defines the API routes for interacting with the blockchain.
    │   ├── services/
    │   │   └── networkManager.js - Manages the connection to the Hyperledger Fabric network, centralizing network-related operations.
    │   ├── test/
    │   │   ├── appBasedLoadTester.js - Script for load testing the application-based approach.
    │   │   └── restAPIBasedLoadTester.js - Script for load testing the REST API-based approach, aiding in performance analysis.
    │   ├── utils/
    │   │   ├── AppUtil.js - Provides utility functions for the application.
    │   │   └── CAUtil.js - Contains utilities for interacting with the Fabric CA.
    │   └── index.js - Entry point for the REST API server application, bootstrapping the server setup.
```
