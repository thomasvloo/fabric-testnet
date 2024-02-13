/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
    buildCAClient,
    registerAndEnrollUser,
    enrollAdmin,
} = require("../utils/CAUtil.js");
const { buildCCPOrg1, buildWallet } = require("../utils/AppUtil.js");

const channelName = process.env.CHANNEL_NAME || "mychannel";
const chaincodeName = "logger"; //process.env.CHAINCODE_NAME || "basic";

const mspOrg1 = "Org1MSP";
const walletPath = path.join(__dirname, "wallet");
const org1UserId = "javascriptAppUser";

const NUMBER_OF_REQUESTS = 400; // Total number of requests to send
const PAYLOAD_SIZE_MIN = 1000; // Minimum size of each payload
const PAYLOAD_SIZE_MAX = 10000; // Maximum size of each payload
let id = 30000;

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

/**
 * Generates a random payload of a size within the specified range.
 * @returns {Object} Payload for the request.
 */
const generatePayload = () => {
    const size =
        PAYLOAD_SIZE_MIN +
        Math.floor(Math.random() * (PAYLOAD_SIZE_MAX - PAYLOAD_SIZE_MIN + 1));
    return generateRandomString(size);
};

/**
 * Generates a random string of a specified length.
 * @param {number} length - Length of the string.
 * @returns {string} A random string.
 */
const generateRandomString = (length) => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
};

async function main() {
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

        // Create a new gateway instance for interacting with the fabric network.
        // In a real application this would be done as the backend server session is setup for
        // a user that has been verified.
        const gateway = new Gateway();

        try {
            // setup the gateway instance
            // The user will now be able to create connections to the fabric network and be able to
            // submit transactions and query. All transactions submitted by this gateway will be
            // signed by this user using the credentials stored in the wallet.
            await gateway.connect(ccp, {
                wallet,
                identity: org1UserId,
                discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
            });

            // Build a network instance based on the channel where the smart contract is deployed
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract(chaincodeName);

            console.log(`sending ${NUMBER_OF_REQUESTS} transactions.`);
            const promises = [];
            for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
                const event = {
                    eventId: `event${id++}`,
                    concept_instance: 22745,
                    id_id: "external",
                    cpee_activity: "external",
                    cpee_instance: "cd5ae992-a9ac-43fa-9782-29a691debb9d",
                    lifecycle_transition: "unkown",
                    cpee_lifecycle_transition: "endpoints/change",
                    data: generatePayload(),
                    time_timestamp: new Date().toISOString(),
                };
                const transactionPromise = contract.submitTransaction(
                    "CreateAsset",
                    JSON.stringify(event)
                );
                promises.push(transactionPromise);
            }
            const startTime = Date.now();
            await Promise.all(promises);

            const endTime = Date.now();
            const durationInSeconds = (endTime - startTime) / 1000;
            const tps = NUMBER_OF_REQUESTS / durationInSeconds;
            console.log(
                `${NUMBER_OF_REQUESTS} requests comitted in ${durationInSeconds} seconds`
            );
            console.log(`Transactions Per Second (TPS): ${tps}`);
        } finally {
            // Disconnect from the gateway when the application is closing
            // This will close all connections to the network
            gateway.disconnect();
        }
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
        process.exit(1);
    }
}

main();
