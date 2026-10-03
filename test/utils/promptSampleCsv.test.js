import {csvToJson, mapCSVData} from "../../src/lib/utils/fileUtils";
import {
  organizeRidesByDuration,
  getClassesTakenByInstructor
} from "../../src/lib/utils/effortUtils";
import {getUniqueValuesFromDataArrayByAttribute} from "../../src/lib/utils/dataUtils";

const sampleCsv = `Workout Timestamp,Live/On-Demand,Instructor Name,Length (minutes),Fitness Discipline,Type,Title,Class Timestamp,Total Output,Avg. Watts,Avg. Resistance,Avg. Cadence (RPM),Avg. Speed (mph),Distance (mi),Calories Burned,Avg. Heartrate,Avg. Incline,Avg. Pace (min/mi)
2020-01-30 09:30 (CDT),Live,Robin Arzon,30,Cycling,Intervals,30 min HIIT Ride,2020-01-30 09:18 (CDT),208,116,45%,67,15.58,7.79,282,,,
2020-02-03 11:07 (CDT),On Demand,Alex Toussaint,30,Cycling,Intervals,30 min HIIT & Hills Ride,2020-01-27 19:19 (CDT),238,132,43%,80,17.63,8.81,322,,,
2023-11-08 12:04 (-06),,,0,Cycling,,Lanebreak Ride,,0,10,30%,20,2.75,0.01,0,,,
2020-04-20 16:40 (CDT),On Demand,,20,Cycling,Scenic Ride,20 min Olympic National Park Scenic Ride,,272,227,61%,69,22.13,7.37,392,,,
2021-01-24 14:36 (CDT),,,33,Cycling,,33 min Just Ride,,402,202,59%,68,20.87,11.56,577,,,
2026-05-08 11:30 (-05),On Demand,,None,Cycling,Scenic Ride,5 KM Alaska Lutak Inlet Ride,,83,128,42%,79,17.52,3.16,118,,,`;

describe("sample CSV integration test", () => {
  it("should parse and map sample CSV containing 0 duration, empty instructor, and missing fields", () => {
    const rawJson = csvToJson(sampleCsv);
    expect(rawJson.length).toBe(6);

    const mapped = mapCSVData(rawJson);
    expect(mapped.Cycling).toBeDefined();

    const cyclingWorkouts = mapped.Cycling;
    const organized = organizeRidesByDuration(cyclingWorkouts);
    expect(organized).toBeDefined();
    expect(organized[0]).toBeUndefined();

    const instructors = getClassesTakenByInstructor(cyclingWorkouts);
    expect(Array.isArray(instructors)).toBe(true);

    const types = getUniqueValuesFromDataArrayByAttribute(cyclingWorkouts, "type");
    expect(Array.isArray(types)).toBe(true);
  });
});
