//test comment
"use strict";
// Node Modules requires
const fs = require("fs");
const axios = require("axios");
const process = require("process");

// Custom functions requires
const testScenarios = require("./test-scenarios");
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

  output[scenario.scenario] = testScenarios(scenario, axiosInstance, promises);
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
