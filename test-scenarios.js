const parseEndpoint = require("./parse-endpoint");
const validateResponse = require("./validate-response");

const testScenarios = (scenario, axiosInstance, promises) => {
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
  return scenarioResult;
};

module.exports = testScenarios;