import {
  createPlotPoint,
  getPlotPointsByDate,
  calculateFTP
} from "../../src/lib/utils/chartUtils";

describe("createPlotPoint", () => {
  it("should return the first var as x and second as y", () => {
    expect(createPlotPoint("first", "second", "title")).toStrictEqual({
      x: "first",
      y: "second",
      title: "title"
    });
    expect(createPlotPoint({a: "a"}, {b: "b"})).toStrictEqual({
      x: {a: "a"},
      y: {b: "b"},
      title: undefined
    });
    expect(createPlotPoint(0, 0)).toStrictEqual({x: 0, y: 0, title: undefined});
  });
});

describe("getPlotPointsByDate", () => {
  it("should return plot points given the data", () => {
    const sampleData = [
      {output: 100, date: "2020-09-25"},
      {output: 100, date: "2020-09-25"},
      {output: 100, date: "2020-09-25"}
    ];

    const yAxis = "output";
    const xAxis = "date";
    const result = getPlotPointsByDate(sampleData, yAxis, xAxis);
    expect(result).toHaveLength(sampleData.length);
    for (let index = 0; index < result.length; index++) {
      expect(result[index].y).toBe(sampleData[index][yAxis]);
      expect(result[index].x).toContain(sampleData[index][xAxis]);
    }
  });

  it("should return plot points given the data", () => {
    const sampleData = [
      {average: 100, createdAt: "2020-09-25"},
      {average: 100, createdAt: "2020-09-25"},
      {average: 100, createdAt: "2020-09-25"}
    ];

    const yAxis = "average";
    const xAxis = "createdAt";
    const result = getPlotPointsByDate(sampleData, yAxis, xAxis);
    expect(result).toHaveLength(sampleData.length);
    for (let index = 0; index < result.length; index++) {
      expect(result[index].y).toBe(sampleData[index][yAxis]);
      expect(result[index].x).toContain(sampleData[index][xAxis]);
    }
  });
});

describe("calculateFTP", () => {
  it("should return 95% of the given value", () => {
    expect(calculateFTP(100)).toBe(95);
    expect(calculateFTP(100.9)).toBe(95);
    expect(calculateFTP(1)).toBe(0);
    expect(calculateFTP(102)).toBe(96);
  });
});
