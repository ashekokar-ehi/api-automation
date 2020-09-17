let data = [];

const tcFormatting = (spacing, obj) => {
  let testCasesResult = [];
  for (let tc in obj) {
    const testCase = obj[tc];
    let testCaseResult = [];
    const oj = {
      name: `${spacing} ${testCase.name}`,
      result: testCase.result,
      expected: testCase.expected,
      expectedStr: testCase.expectedStr,
      actual: testCase.actual,
      actualStr: testCase.actualStr,
    };
    testCaseResult.push(oj);
    if (testCase.afterIt) {
      testCaseResult = [
        ...testCaseResult,
        ...tcFormatting(`---${spacing}`, testCase.afterIt),
      ];
    }
    testCasesResult = [...testCasesResult, ...testCaseResult];
  }

  return testCasesResult;
};

const formatOutput = (output) => {
  for (let op in output) {
    // act on scenario level
    const dt = { name: op };
    data.push(dt);
    // act on tc level
    data = [...data, ...tcFormatting("---", output[op])];
  }

  console.table(data, ["name", "result", "expected", "actual"]);
  return data;
};

module.exports = formatOutput;
