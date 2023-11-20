"use strict";

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
    buildCAClient,
    registerAndEnrollUser,
    enrollAdmin,
} = require("../utils/CAUtil");
const { buildCCPOrg1, buildWallet } = require("../utils/AppUtil");

const channelName = process.env.CHANNEL_NAME || "mychannel";
const chaincodeName = process.env.CHAINCODE_NAME || "logger";

const mspOrg1 = "Org1MSP";
const walletPath = path.join(__dirname, "wallet");
const org1UserId = "javascriptAppUser";

class NetworkManager {
    constructor() {
        this.gateway = new Gateway();
        this.contract = null;
    }

    async connect() {
        try {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPOrg1();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            const caClient = buildCAClient(
                FabricCAServices,
                ccp,
                "ca.org1.example.com"
            );

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);

            // in a real application this would be done on an administrative flow, and only once
            await enrollAdmin(caClient, wallet, mspOrg1);

            // in a real application this would be done only when a new user was required to be added
            // and would be part of an administrative flow
            await registerAndEnrollUser(
                caClient,
                wallet,
                mspOrg1,
                org1UserId,
                "org1.department1"
            );

            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.
            await this.gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await this.gateway.getNetwork(channelName);

            // Get the contract from the network.
            this.contract = network.getContract(chaincodeName);
        } catch (error) {
            console.error(`******** FAILED to run the application: ${error}`);
            process.exit(1);
        }
    }

    async disconnect() {
        this.gateway.disconnect();
    }
}
module.exports = new NetworkManager();
