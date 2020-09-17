const validateResponse = (() => {
    return (matchType, actualResponse, expectedResponse) => {
        console.log("hello",matchType, actualResponse, expectedResponse);
        if(matchType === 'matchFull'){
            return _.isEqual(actualResponse, expectedResponse);
          } else if(matchType === 'contains'){
            return checkIfContains(actualResponse,expectedResponse);
          }
    }
})();

const checkIfContains = (mainObj, subObj) => {
    return Object.keys(subObj).every(ele => {
        if (typeof subObj[ele] == 'object') {
            return checkIfContains(mainObj[ele], subObj[ele]);
        }
        return subObj[ele] === mainObj[ele]
    });
  }

module.exports = validateResponse;