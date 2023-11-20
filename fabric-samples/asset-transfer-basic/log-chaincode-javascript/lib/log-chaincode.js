/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

// Deterministic JSON.stringify()
const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { Contract } = require("fabric-contract-api");

class ChaincodeLog extends Contract {
  async InitLedger(ctx) {
    const events = [
      {
        eventId: "event1",
        concept_instance: 22745,
        id_id: "external",
        cpee_activity: "external",
        cpee_instance: "cd5ae992-a9ac-43fa-9782-29a691debb9d",
        lifecycle_transition: "unkown",
        cpee_lifecycle_transition: "endpoints/change",
        data: [
          {
            name: "bookAir",
            value:
              "http://gruppe.wst.univie.ac.at/~mangler/services/airline.php",
          },
          {
            name: "timeout",
            value: "https://cpee.org/services/timeout.php",
          },
          {
            name: "bookHotel",
            value: "http://gruppe.wst.univie.ac.at/~mangler/services/hotel.php",
          },
          {
            name: "subprocess",
            value: "https://cpee.org/flow/start/url/",
          },
          {
            name: "approve",
            value:
              "http://gruppe.wst.univie.ac.at/~mangler/services/approval.php",
          },
        ],
        time_timestamp: "2023-10-24T13:37:59.531+02:00",
      },
      {
        eventId: "event2",
        concept_instance: 22745,
        id_id: "external",
        cpee_activity: "external",
        cpee_instance: "cd5ae992-a9ac-43fa-9782-29a691debb9d",
        lifecycle_transition: "unkown",
        cpee_lifecycle_transition: "attributes/change",
        data: [
          {
            name: "theme",
            value: "extended",
          },
          {
            name: "info",
            value: "Coopis 2010",
          },
          {
            name: "creator",
            value: "Christine Ashcreek",
          },
          {
            name: "author",
            value: "Christine Ashcreek",
          },
          {
            name: "modelType",
            value: "CPEE",
          },
          {
            name: "design_stage",
            value: "development",
          },
          {
            name: "guarded",
            value: "none",
          },
          {
            name: "design_dir",
            value: "Templates.dir",
          },
          {
            name: "guarded_id",
            value: "",
          },
          {
            name: "model_uuid",
            value: "a1cbb855-90e3-4d8c-b44b-d3ba7bff9f4e",
          },
          {
            name: "model_version",
            value: "",
          },
        ],
        time_timestamp: "2023-10-24T13:37:59.535+02:00",
      },
      {
        eventId: "event3",
        concept_instance: 22745,
        concept_name: "Book Airline 1",
        concept_endpoint:
          "http://gruppe.wst.univie.ac.at/~mangler/services/airline.php",
        id_id: "a1",
        cpee_activity: "a1",
        cpee_activity_uuid: "62052b9e33080c091e21daeee91a2d39",
        cpee_instance: "cd5ae992-a9ac-43fa-9782-29a691debb9d",
        lifecycle_transition: "start",
        cpee_lifecycle_transition: "activity/calling",
        data: [
          {
            name: "from",
            value: "Vienna",
          },
          {
            name: "to",
            value: "Prague",
          },
          {
            name: "persons",
            value: 3,
          },
        ],
        time_timestamp: "2023-10-24T13:38:02.526+02:00",
      },
    ];

    for (const event of events) {
      event.docType = "event";
      await ctx.stub.putState(
        event.eventId,
        Buffer.from(stringify(sortKeysRecursive(event)))
      );
    }
  }

  // CreateAsset issues a new asset to the world state with given details.
  async CreateAsset(ctx, paramString) {
    const params = JSON.parse(paramString);
    const { eventId } = params;
    if (!eventId) {
      throw new Error("The eventId attribute must be provided");
    }
    const exists = await this.AssetExists(ctx, eventId);
    if (exists) {
      throw new Error(`The event log ${eventId} already exists`);
    }
    await ctx.stub.putState(
      eventId,
      Buffer.from(stringify(sortKeysRecursive(params)))
    );
    return JSON.stringify(params);
  }

  // ReadAsset returns the asset stored in the world state with given id.
  async ReadAsset(ctx, eventId) {
    const eventJSON = await ctx.stub.getState(eventId); // get the asset from chaincode state
    if (!eventJSON || eventJSON.length === 0) {
      throw new Error(`The event ${eventId} does not exist`);
    }
    return eventJSON.toString();
  }

  // GetAllAssets returns all assets found in the world state.
  async GetAllAssets(ctx) {
    const allResults = [];
    // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }

  // AssetExists returns true when asset with given ID exists in world state.
  async AssetExists(ctx, eventId) {
    const assetJSON = await ctx.stub.getState(eventId);
    return assetJSON && assetJSON.length > 0;
  }
}

module.exports = ChaincodeLog;
