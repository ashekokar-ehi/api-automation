const parseEndpoint = require("./parse-endpoint");
const validateResponse = require("./validate-response");
const validateSchema = require("./validate-schema");

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
        if(then.responseBodyType){
          isSuccessful = validateResponse(
            then.responseBodyType,
            response,
            then.responseBody
          );
        }else if(then.responseSchemaType){
          isSuccessful = then.responseSchemaType === 'matchFull' ? 
                          validateSchema( response, then.responseBody) : 
                          validateSchema(then.responseBody, response); 
        }
      })
      .catch((error) => {
        actual = error.message; // JSON.stringify(error);
        isSuccessful = validateResponse(
          then.responseBodyType,
          error.response,
          then.responseBody
        );
      })
      .finally(() => {
        if (isSuccessful) {
          tcResult.result = "success";
          afterIt &&
            (tcResult.afterIt = testScenarios(
              afterIt,
              axiosInstance,
              promises
            ));
        } else {
          tcResult.result = "failure";
          tcResult.expected = then.responseBody;
          // tcResult.expectedStr = JSON.stringify(tcResult.expected).replace(
          //   /,/g,
          //   "::"
          // );
          tcResult.actual = actual;
          // tcResult.actualStr = JSON.stringify(tcResult.actual).replace(
          //   /,/g,
          //   "::"
          // );
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
