const {
  filterByTitle,
  filterWorkoutsByDate,
  getLongestWorkout,
  getRidesByDuration,
  organizeRidesByDuration,
  getUniqueWorkoutTypes,
  getHighestOutputWorkout,
  getHighestOutputRidesByDuration,
  getAverageOutputs,
  filterSameDayWorkouts,
  getDatesWithMultipleWorkouts,
  getAverageOutputByRideDuration,
  getClassesTakenByInstructor,
  getAverageCadence,
  getAverageResistance,
  getOrganizedRidesSortedByOutput,
  getAverageOutputByRideType,
  getAverageOutputByInstructor
} = require("../../src/lib/utils/effortUtils");
import { sampleData1 } from "./sampleData";

let sampleData;

beforeEach(() => {
  sampleData = sampleData1;
});

afterEach(() => {
  sampleData = [];
});

describe("filterByTitle", () => {
  it("should remove any rides that have a title matching the list of filters", () => {
    const filteredRideTitle = "Tabata";
    const result = filterByTitle(sampleData, [filteredRideTitle]);
    expect(result).toHaveLength(6);
    result.forEach((element) => {
      expect(element).toEqual(expect.not.stringContaining(filteredRideTitle));
    });
  });
  it("should return an empty array if all items are filtered out", () => {
    const filteredRides = [
      "Tabata",
      "Climb",
      "HIIT",
      "XOXO Cody",
      "30 min Ministry of Sound: I Love Ibiza"
    ];
    const result = filterByTitle(sampleData, filteredRides);
    expect(result).toHaveLength(0);
  });
  it("should not include a workout if the title is not there", () => {
    const overridenSampleData = [...sampleData];
    // Object missing title
    overridenSampleData.push({
      output: 400,
      duration: 45,
      date: "2020-02-21",
      instructor: "Ben Alldis",
      distance: 15.5
    });
    const result = filterByTitle(overridenSampleData, []);
    // Should be the original length, without the bad record
    expect(result).toHaveLength(sampleData.length);
  });
});

describe("getRidesByDuration", () => {
  it("should return all rides that start with the given length", () => {
    const rideLength = 30;
    const result = getRidesByDuration(sampleData, rideLength);
    result.forEach((element) => {
      expect(element.title.startsWith(rideLength)).toBe(true);
    });
  });
  it("should return no rides if none match the given length", () => {
    const rideLength = 60;
    const result = getRidesByDuration(sampleData, rideLength);
    expect(result).toHaveLength(0);
  });
});

describe("organizeRidesByDuration", () => {
  it("should organize ride arrays in an object by length", () => {
    const organizedRides = organizeRidesByDuration(sampleData);
    expect(Object.keys(organizedRides).length).toBe(3);
    expect(organizedRides[20].length).toBe(2);
    expect(organizedRides[30].length).toBe(4);
    expect(organizedRides[45].length).toBe(4);

    // Just verifying one
    organizedRides[45].forEach((element) => {
      expect(element.duration).toBe(45);
    });
  });
  it("should handle an empty array gracefully", () => {
    expect(organizeRidesByDuration([])).toMatchObject({});
  });
  it("should throw an error if data does not include duration", () => {
    const badData = [...sampleData, { title: "30 Min I dont have a duration" }];
    expect(() => {
      organizeRidesByDuration(badData);
    }).toThrow();
  });
});

describe("getUniqueWorkoutTypes", () => {
  it("should return unique ride types", () => {
    const result = getUniqueWorkoutTypes(sampleData);
    expect(result).toHaveLength(5);
    expect(result).toEqual(
      expect.arrayContaining([
        "Tabata",
        "HIIT",
        "Climb",
        "XOXO Cody",
        "Ministry of Sound: I Love Ibiza"
      ])
    );
  });
});

describe("getHighestOutputWorkout", () => {
  it("should return the ride object with the highest output", () => {
    const result = getHighestOutputWorkout(sampleData);
    // Hardcoded the first record has having the highest output
    expect(result).toMatchObject(sampleData[0]);
  });
  it("should return an error if input is empty", () => {
    expect(() => getHighestOutputWorkout([])).toThrow();
  });
});

describe("getHighestOutputRidesByDuration", () => {
  it("should return the best rides by length", () => {
    const result = getHighestOutputRidesByDuration(organizeRidesByDuration(sampleData));

    // 45 Minute Ride
    expect(result[2]).toMatchObject(sampleData[0]);
    // 30 Minute Ride (earliest in the list wins in a tie)
    expect(result[1]).toMatchObject(sampleData[2]);
    // 20 Minute Ride
    expect(result[0]).toMatchObject(sampleData[9]);
  });
});

describe("getAverageOutputs", () => {
  it("should average output per minute by ride", () => {
    const result = getAverageOutputs(sampleData);
    expect(result).toHaveLength(sampleData.length);
    expect(result[0].average).toBe(sampleData[0].output / sampleData[0].duration);
    expect(result[1].average).toBe(sampleData[1].output / sampleData[1].duration);
    expect(result[2].average).toBe(sampleData[2].output / sampleData[2].duration);
    expect(result[3].average).toBe(sampleData[3].output / sampleData[3].duration);
    expect(result[4].average).toBe(sampleData[4].output / sampleData[4].duration);
    expect(result[5].average).toBe(sampleData[5].output / sampleData[5].duration);
    expect(result[6].average).toBe(sampleData[6].output / sampleData[6].duration);
    expect(result[7].average).toBe(sampleData[7].output / sampleData[7].duration);
    expect(result[8].average).toBe(sampleData[8].output / sampleData[8].duration);
    expect(result[9].average).toBe(sampleData[9].output / sampleData[9].duration);

    expect(result[0].title).toBe(sampleData[0].title);
    expect(result[1].title).toBe(sampleData[1].title);
    expect(result[2].title).toBe(sampleData[2].title);
    expect(result[3].title).toBe(sampleData[3].title);
    expect(result[4].title).toBe(sampleData[4].title);
    expect(result[5].title).toBe(sampleData[5].title);
    expect(result[6].title).toBe(sampleData[6].title);
    expect(result[7].title).toBe(sampleData[7].title);
    expect(result[8].title).toBe(sampleData[8].title);
    expect(result[9].title).toBe(sampleData[9].title);
  });
});

describe("getDatesWithMultipleWorkouts", () => {
  const data = [
    { date: "2020-11-01" },
    { date: "2020-11-01" },
    { date: "2020-11-02" },
    { date: "2020-11-02" },
    { date: "2020-11-03" }
  ];
  it("should return dates with multiple rides", () => {
    const result = getDatesWithMultipleWorkouts(data);
    expect(result).toHaveLength(2);
    expect(result).toContain(data[0].date);
    expect(result).toContain(data[2].date);
  });
});

describe("filterSameDayWorkouts", () => {
  it("should leave the best ride for a day with multiple rides", () => {
    const originalLength = sampleData.length;
    const result = filterSameDayWorkouts(sampleData);

    expect(result).toHaveLength(originalLength - 1);
    // Higher Output - hardcoded the first in sampledata to be highest
    expect(result[0]).toStrictEqual(sampleData[0]);
  });
  it("should handle an empty an array", () => {
    expect(filterSameDayWorkouts([])).toStrictEqual([]);
  });
  it("should handle data without output and use the longest duration", () => {
    const stretchingData = [
      {
        instructor: "Jess King",
        duration: 5,
        type: "Pre & Post-Run Stretch",
        title: "5 min Post-Run Stretch",
        date: "2020-10-04"
      },
      {
        instructor: "Denis Morton",
        duration: 10,
        type: "Pre & Post-Ride Stretch",
        title: "10 min Post-Ride Stretch",
        date: "2020-10-04"
      }
    ];
    expect(filterSameDayWorkouts(stretchingData).length).toBe(1);
    expect(filterSameDayWorkouts(stretchingData)[0].duration).toBe(10);
  });
});

describe("getAverageOutputByRideDuration", () => {
  it("should organize ride arrays in an object by length", () => {
    const organizedRides = organizeRidesByDuration(sampleData);
    const result = getAverageOutputByRideDuration(organizedRides);

    expect(result).toHaveLength(3);
    result.forEach((element) => {
      expect(element).toHaveProperty("value");
      expect(element).toHaveProperty("color");
      expect(element).toHaveProperty("duration");
    });
  });
});

describe("getClassesTakenByInstructor", () => {
  it("should return an ordered list of instructors with number of classes taken", () => {
    const result = getClassesTakenByInstructor(sampleData);
    expect(result).toHaveLength(3);

    result.forEach((element) => {
      expect(element).toHaveProperty("instructor");
      expect(element).toHaveProperty("count");
    });
  });
  it("should log an error and return an empty string if there is an error", () => {
    const badData = sampleData.concat().push({ notInstructor: "bad data" });
    console.error = jest.fn();
    expect(getClassesTakenByInstructor(badData)).toStrictEqual([]);
    expect(console.error).toHaveBeenCalled();
  });
});

describe("getAverageCadence", () => {
  it("should return an array of average cadences with corresponding date", () => {
    const data = [
      { averageCadence: 100, date: "2020-01-01" },
      { averageCadence: 100, date: "2020-01-01" },
      { averageCadence: 100, date: "2020-01-01" }
    ];
    const result = getAverageCadence(data);
    expect(result).toHaveLength(3);
    result.forEach((element, i) => {
      expect(element).toHaveProperty("average");
      expect(element.average).toBe(data[i].averageCadence);
      expect(element).toHaveProperty("createdAt");
      expect(element.createdAt).toBe(data[i].date);
    });
  });
});

describe("getAverageResistance", () => {
  it("should return an array of average Resistances with corresponding date", () => {
    const data = [
      { averageResistance: 100, date: "2020-01-01" },
      { averageResistance: 100, date: "2020-01-01" },
      { averageResistance: 100, date: "2020-01-01" }
    ];
    const result = getAverageResistance(data);
    expect(result).toHaveLength(3);
    result.forEach((element, i) => {
      expect(element).toHaveProperty("average");
      expect(element.average).toBe(data[i].averageResistance);
      expect(element).toHaveProperty("createdAt");
      expect(element.createdAt).toBe(data[i].date);
    });
  });
});

describe("getOrganizedRidesSortedByOutput", () => {
  it("should return the organized rides sorted by output", () => {
    const data = organizeRidesByDuration(sampleData);
    const result = getOrganizedRidesSortedByOutput(data);
    const keys = Object.keys(result);

    // eslint-disable-next-line no-unused-vars
    for (const [i, key] of keys.entries()) {
      result[key].forEach((element, i) => {
        if (i > 0) {
          // Nothing to test first element against
          expect(element.output).toBeLessThanOrEqual(result[key][i - 1].output);
        }
      });
    }
  });
});

describe("getAverageOutputByRideType", () => {
  it("should return an array of objects containing ride types and an average output number", () => {
    const result = getAverageOutputByRideType(sampleData);
    result.forEach((item) => {
      expect(item).toHaveProperty("type");
      expect(item).toHaveProperty("averageOutput");
    });
  });
});

describe("getAverageOutputByInstructor", () => {
  it("should return an array of objects containing instructors and an avergae output number", () => {
    const result = getAverageOutputByInstructor(sampleData);
    result.forEach((item) => {
      expect(item).toHaveProperty("instructor");
      expect(item).toHaveProperty("averageOutput");
    });
    expect(result.length).toBe(3);
  });
});

describe("filterWorkoutsByDate", () => {
  it("should return an array of objects filtered by date", () => {
    const startDate = "2020-02-14";
    const endDate = "2020-02-16";
    const result = filterWorkoutsByDate(sampleData, startDate, endDate);

    // Based on the sample data - this could break is sample data changes
    expect(result).toHaveLength(3);
    expect(result[0].date).toBe("2020-02-16");
  });
});

describe("getLongestWorkout", () => {
  it("should return the longest workout", () => {
    const result = getLongestWorkout(sampleData);
    // Based on the sample data - this could break is sample data changes
    expect(result.duration).toBe(45);
  });
  it("should throw an error if workouts is undefined", () => {
    expect(() => {
      getLongestWorkout(undefined);
    }).toThrow();
    expect(() => {
      getLongestWorkout([]);
    }).toThrow();
  });
});
