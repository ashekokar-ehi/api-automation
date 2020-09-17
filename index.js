//test comment
"use strict";
// Node Modules requires
const fs = require("fs");
const axios = require("axios");
const process = require("process");

// Custom functions requires
const parseEndpoint = require("./parse-endpoint");
const validateResponse = require("./validate-response");
const formatOutput = require("./format-output");

const promises = [];
const rawdata = fs.readFileSync("scenario.json");
const scenarios = JSON.parse(rawdata);

let allSucceed = true;
const output = {};
scenarios.forEach((scenario) => {
  const axiosInstance = axios.create();
  scenario.authToken &&
    (axiosInstance.defaults.headers.common["Authorization"] =
      scenario.authToken);

  const scenarioResult = {};
  scenario.testCases.forEach(({ name, given, when, then }) => {
    const tcResult = {};
    tcResult.name = name;
    const type = when.type;
    const endpoint = parseEndpoint(when.endpoint, given.queryParams);
    let isSuccessful = false;
    let actual = {};

    const promise = axiosInstance[type](endpoint, given.bodyParams)
      .then((response) => {
        actual = response.data;
        isSuccessful = validateResponse(response, then);
      })
      .catch((error) => {
        actual = error.message; // JSON.stringify(error);
        isSuccessful = validateResponse(error, then);
      })
      .finally(() => {
        if (isSuccessful) {
          tcResult.result = "success";
        } else {
          tcResult.result = "failure";
          tcResult.expected = then.responseBody;
          tcResult.expectedStr = JSON.stringify(tcResult.expected).replace(
            /,/g,
            "::"
          );
          tcResult.actual = actual;
          tcResult.actualStr = JSON.stringify(tcResult.actual).replace(
            /,/g,
            "::"
          );
          allSucceed = false;
          process.exitCode = 2;
        }
        scenarioResult[name] = tcResult;
      });
    promises.push(promise);
  });
  output[scenario.scenario] = scenarioResult;
});

Promise.allSettled(promises).then(() => {
  const data = formatOutput(output);
  let stringData = "Name, Result, Expected, Actual\n";
  for (let d of data) {
    stringData = `${stringData}${d.name}, ${d.result || ""}, ${
      d.expectedStr || ""
    }, ${d.actualStr || ""}\n`;
  }
  fs.writeFile("test-result.csv", stringData, function (err) {
    if (err) {
      return console.log(("Error is:", err));
    }
    console.log("Output Logged to test-result.csv");
  });

  if (!allSucceed) {
    console.log("One or more test cases are failing");
  }
});
