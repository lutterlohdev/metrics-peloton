import {
  getAverageFromArray,
  sortArrayByAttributeInObject,
  sliceArrayByGivenMax,
  getUniqueValuesFromDataArrayByAttribute,
  getTotalByAttribute
} from "../../src/lib/utils/dataUtils";
import {sampleData1} from "./sampleData";

let sampleData;

beforeEach(() => {
  sampleData = sampleData1;
});
describe("getAverageFromArray", () => {
  it("should return an average of the given data", () => {
    const testData = [{output: 10}, {output: 10}, {output: 10}, {output: 10}, {output: 10}];
    expect(getAverageFromArray(testData, "output")).toBe(10);
  });
  it("should handle an empty input by return a zero", () => {
    expect(getAverageFromArray([], "output")).toBe(0);
  });
});

describe("sortArrayByAttributeInObject", () => {
  const data = [
    {count: 1, value: "least"},
    {count: 5, value: "most"},
    {count: 3, value: "middle"}
  ];
  it("should sort an array given the attribute value", () => {
    const result = sortArrayByAttributeInObject(data, "count");
    expect(result).toHaveLength(3);
    expect(result[2].value).toBe("least");
    expect(result[1].value).toBe("middle");
    expect(result[0].value).toBe("most");
  });
});

describe("sliceArrayByGivenMax", () => {
  const array = [1, 2, 3, 4, 5];
  it("should shorten array given a max", () => {
    expect(sliceArrayByGivenMax(array, 3)).toHaveLength(3);
    expect(sliceArrayByGivenMax(array, 2)).toStrictEqual([4, 5]);
  });
  it("should just return the given array of the length is less than max", () => {
    expect(sliceArrayByGivenMax(array, 8)).toHaveLength(5);
    expect(sliceArrayByGivenMax(array, 8)).toStrictEqual([1, 2, 3, 4, 5]);
  });
});

describe("getUniqueValuesFromDataArrayByAttribute", () => {
  const data = [
    {date: "2020-11-01"},
    {date: "2020-11-01"},
    {date: "2020-11-02"},
    {date: "2020-11-02"}
  ];
  it("should return an array of unique dates", () => {
    const result = getUniqueValuesFromDataArrayByAttribute(data, "date");
    expect(result).toHaveLength(2);
    expect(result).toContain(data[0].date);
    expect(result).toContain(data[2].date);
  });
  it("should return empty for an empty input", () => {
    expect(getUniqueValuesFromDataArrayByAttribute([])).toStrictEqual([]);
  });
});

describe("getTotalByAttribute", () => {
  it("should return a sum of the given attribute", () => {
    const result = getTotalByAttribute(sampleData, "distance");
    expect(result).toBe(121);
  });
  it("should return 0 if array is undefined", () => {
    const result = getTotalByAttribute(undefined, "distance");
    expect(result).toBe(0);
  });
});
