const _ = require("lodash");

const checkIfContains = (mainObj, subObj) => {
  return Object.keys(subObj).every((ele) => {
    if (typeof subObj[ele] == "object") {
      return checkIfContains(mainObj[ele], subObj[ele]);
    }
    return subObj[ele] === mainObj[ele];
  });
};

const validateResponse = (() => {
  return (matchType, actualResponse, expectedResponse) => {
    let isValid = true;
    if (expectedResponse.data) {
      if (matchType === "matchFull") {
        isValid = _.isEqual(actualResponse.data, expectedResponse.data);
      } else if (matchType === "contains") {
        isValid = checkIfContains(actualResponse.data, expectedResponse.data);
      }
    }
    if (isValid) {
      const props = _.omit(expectedResponse, "data");
      for (let key in props) {
        isValid = _.isEqual(props[key], actualResponse[key]) && isValid;
      }
    }
    return isValid;
  };
})();

module.exports = validateResponse;
