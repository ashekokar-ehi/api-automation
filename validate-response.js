const validateResponse = (() => {
    let flag = false;
    return () => {
        // flag = !flag;
        return flag;
    }
})();

module.exports = validateResponse;