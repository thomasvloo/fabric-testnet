# Fabric - testnet

A NodeJs & Express backend server to interact with a Hyperledger Fabric test network.

## Prerequisite software

- Git
- cURL
- Docker
- Optional: Go
- Optional: JQ

## Install Fabric Docker Container images & Binaries

run the following command to install the Hyperledger Fabric Docker container images and binaries:

`./install-fabric.sh docker binary`

## Start up the Fabric test net

Open a terminal and cd into the fabric-samples/test-network directory:

`cd fabric-samples/test-network`

Start the two organization test network, setup with 2 peers, ordering service, and 2 certificate authorities:

`./network.sh up createChannel -ca`

The following deploy command will package, install, approve, and commit the javascript chaincode, all the actions it takes to deploy a chaincode to a channel:

`./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript`

To stop the network and cleanup run:

`./network.sh down`

## Start the NodeJs & Express Server

Once the Hyperledger Fabric test network is up and running, open a new terminal and cd into the Fabric-API folder

`cd Fabric-API`

Enter the following command to install the necessary dependencies using Yarn package manager:

`yarn`

Enter the following command to start the server (port 3000)

`yarn start`

To stop the server press `CTRL+C`
