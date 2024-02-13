/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const chaincodeLog = require("./lib/log-chaincode");

module.exports.ChaincodeLog = chaincodeLog;
module.exports.contracts = [chaincodeLog];
