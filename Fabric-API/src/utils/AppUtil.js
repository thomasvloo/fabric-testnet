/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Builds and returns the connection profile for Org1 from a configuration file.
 * This configuration profile is used to connect to the Hyperledger Fabric network as Org1.
 * @returns {Object} The connection profile object for Org1.
 * @throws {Error} If the configuration file does not exist.
 */
exports.buildCCPOrg1 = () => {
    // load the common connection configuration file
    const ccpPath = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "fabric-samples",
        "test-network",
        "organizations",
        "peerOrganizations",
        "org1.example.com",
        "connection-org1.json"
    );
    const fileExists = fs.existsSync(ccpPath);
    if (!fileExists) {
        throw new Error(`no such file or directory: ${ccpPath}`);
    }
    const contents = fs.readFileSync(ccpPath, "utf8");

    // build a JSON object from the file contents
    const ccp = JSON.parse(contents);

    console.log(`Loaded the network configuration located at ${ccpPath}`);
    return ccp;
};

/**
 * Builds and returns the connection profile for Org2 from a configuration file.
 * This configuration profile is used to connect to the Hyperledger Fabric network as Org2.
 * @returns {Object} The connection profile object for Org2.
 * @throws {Error} If the configuration file does not exist.
 */
exports.buildCCPOrg2 = () => {
    // load the common connection configuration file
    const ccpPath = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "fabric-samples",
        "test-network",
        "organizations",
        "peerOrganizations",
        "org2.example.com",
        "connection-org2.json"
    );
    const fileExists = fs.existsSync(ccpPath);
    if (!fileExists) {
        throw new Error(`no such file or directory: ${ccpPath}`);
    }
    const contents = fs.readFileSync(ccpPath, "utf8");

    // build a JSON object from the file contents
    const ccp = JSON.parse(contents);

    console.log(`Loaded the network configuration located at ${ccpPath}`);
    return ccp;
};

/**
 * Builds a wallet for managing identities, either in the file system or in memory.
 * @param {Wallets} Wallets - The Wallets class from Fabric SDK.
 * @param {string} walletPath - The file system path to store the wallet. If not provided, an in-memory wallet is used.
 * @returns {Promise<Wallet>} A promise that resolves to the wallet object.
 */
exports.buildWallet = async (Wallets, walletPath) => {
    // Create a new  wallet : Note that wallet is for managing identities.
    let wallet;
    if (walletPath) {
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Built a file system wallet at ${walletPath}`);
    } else {
        wallet = await Wallets.newInMemoryWallet();
        console.log("Built an in memory wallet");
    }

    return wallet;
};

/**
 * Formats a JSON string to be more human-readable.
 * @param {string} inputString - The JSON string to format.
 * @returns {string} The formatted JSON string or the original input string if it's falsy.
 */
exports.prettyJSONString = (inputString) => {
    if (inputString) {
        return JSON.stringify(JSON.parse(inputString), null, 2);
    } else {
        return inputString;
    }
};
