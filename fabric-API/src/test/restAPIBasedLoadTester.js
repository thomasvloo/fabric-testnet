const axios = require("axios");

const API_ENDPOINT = "http://localhost:3000/contract/createAsset";
const NUMBER_OF_REQUESTS = 4000; // Total number of requests to send
const PAYLOAD_SIZE_MIN = 1000; // Minimum size of each payload
const PAYLOAD_SIZE_MAX = 10000; // Maximum size of each payload
var INITIAL_ID = 190000;

/**
 * Generates a random payload of a size within the specified range.
 * @returns {Object} Payload for the request.
 */
const generatePayload = () => {
    const size =
        PAYLOAD_SIZE_MIN +
        Math.floor(Math.random() * (PAYLOAD_SIZE_MAX - PAYLOAD_SIZE_MIN + 1));
    const event = {
        eventId: `event${INITIAL_ID}`,
        concept_instance: 22745,
        id_id: "external",
        cpee_activity: "external",
        cpee_instance: "cd5ae992-a9ac-43fa-9782-29a691debb9d",
        lifecycle_transition: "unkown",
        cpee_lifecycle_transition: "endpoints/change",
        data: generateRandomString(size),
        time_timestamp: new Date().toISOString(),
    };
    INITIAL_ID += 1;
    return event;
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

/**
 * Sends a POST request to the API endpoint with a random-sized payload.
 */
const sendRequest = async () => {
    try {
        const payload = generatePayload();
        await axios.post(API_ENDPOINT, payload);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

/**
 * Tests the TPS by sending a number of requests with random-sized payloads.
 */
const testTPS = async () => {
    const requests = [];
    for (let i = 0; i < NUMBER_OF_REQUESTS; i++) {
        requests.push(sendRequest());
    }

    const startTime = Date.now();
    await Promise.all(requests);
    const endTime = Date.now();

    const durationInSeconds = (endTime - startTime) / 1000;
    const tps = NUMBER_OF_REQUESTS / durationInSeconds;

    console.log(
        `${NUMBER_OF_REQUESTS} requests comitted in ${durationInSeconds} seconds`
    );
    console.log(`Transactions Per Second (TPS): ${tps}`);
};

testTPS();
