const parseEndpoint = require("./parse-endpoint");
const validateResponse = require("./validate-response");

const testScenarios = (testCases, axiosInstance, promises) => {
  const scenarioResult = {};
  testCases.forEach(({ name, given, when, then, afterIt }) => {
    const tcResult = {};
    tcResult.name = name;
    const type = when.type;
    const endpoint = parseEndpoint(when.endpoint, given.queryParams);
    let isSuccessful = false;
    let actual = {};

    const promise = axiosInstance[type](endpoint, given.bodyParams)
      .then((response) => {
        actual = response.data;
        isSuccessful = validateResponse(then.responseBodyType, response.data, then.responseBody.data);
      })
      .catch((error) => {
        actual = error.message; // JSON.stringify(error);
        isSuccessful = validateResponse(then.responseBodyType, response.data, then.responseBody.data);
      })
      .finally(() => {
        if (isSuccessful) {
          tcResult.result = "success";
          afterIt &&
            (tcResult.afterIt = testScenarios(afterIt, axiosInstance, promise));
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
