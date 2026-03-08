const fs = require("fs");
const path = require("path");
const {csvToJson, mapCSVData} = require("../../src/lib/utils/fileUtils");

let csv = "";

beforeEach(() => {
  try {
    csv = fs.readFileSync(path.resolve(__dirname, "./testData.csv"), "utf8");
  } catch (err) {
    console.error(err);
  }
});

describe("csvToJson", () => {
  it("should convert csv data to a json object", () => {
    const result = csvToJson(csv);
    expect(result).toHaveLength(167);
    const expectedKeys = [
      "Workout Timestamp",
      "Live/On-Demand",
      "Instructor Name",
      "Length (minutes)",
      "Fitness Discipline",
      "Type",
      "Title",
      "Class Timestamp",
      "Total Output",
      "Avg. Watts",
      "Avg. Resistance",
      "Avg. Cadence (RPM)",
      "Avg. Speed (mph)",
      "Distance (mi)",
      "Calories Burned",
      "Avg. Heartrate",
      "Avg. Incline",
      "Avg. Pace (min/mi)"
    ];
    result.forEach((element) => {
      const keys = Object.keys(element);
      expect.arrayContaining(expectedKeys);
    });
  });
});
