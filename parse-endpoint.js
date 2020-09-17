const parseEndpoint = (() => {
  const regEx = /{{([^{{]*?)}}/g;

  const checkForSubstitutors = (str) => regEx.test(str);

  const getSubstitueValue = (object) => (regexMatch, placeholder) => {
    return object[placeholder];
  };

  return (input, object) => {
    while (checkForSubstitutors(input)) {
      input = input.replace(regEx, getSubstitueValue(object));
    }
    return input;
  };
})();

module.exports = parseEndpoint;
