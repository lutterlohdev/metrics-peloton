import {
  trimTitle,
  convertStringToID,
  removeLiveRideTitleSequence,
  findIndexOfTimeUnit
} from "../../src/lib/utils/stringUtils";

describe("trimTitle", () => {
  it('should trim "min" from the ride title', () => {
    expect(trimTitle("30 min Tabata Ride")).toBe("Tabata Ride");
    expect(trimTitle("45 min Together We Go Far")).toBe("Together We Go Far");
    expect(trimTitle("Tabata Ride")).toBe("Tabata Ride");
    expect(trimTitle("Extra 10: Climb Ride")).toBe("Climb Ride");
    expect(trimTitle("30 min XOXO, Cody: Festive Fantasy")).toBe("XOXO, Cody: Festive Fantasy");
    expect(trimTitle("30 min HIIT & Hills Ride: Live from LA")).toBe("HIIT & Hills Ride");
    expect(trimTitle("30 min Ministry of Sound: 30th Birthday")).toBe(
      "Ministry of Sound: 30th Birthday"
    );
  });
  it('should trim "min" from the ride title and Ride suffix', () => {
    // With flag true
    expect(trimTitle("30 min Tabata Ride", true)).toBe("Tabata");
    expect(trimTitle("Extra 10: Climb Ride", true)).toBe("Climb");
  });
});

describe("convertStringToID", () => {
  it("should make a string lowercase and insert dashes for spaces", () => {
    expect(convertStringToID("This is my string")).toBe("this-is-my-string");
    expect(convertStringToID("Oneword")).toBe("oneword");
    expect(convertStringToID("This is my string with 123")).toBe("this-is-my-string-with-123");
    expect(convertStringToID("123456")).toBe("123456");
  });
});

describe("removeLiveRideTitleSequence", () => {
  it("should remove the Live ride title sequences", () => {
    expect(removeLiveRideTitleSequence("30 min HIIT & Hills Ride: Live from Home")).toBe(
      "30 min HIIT & Hills Ride"
    );
    expect(removeLiveRideTitleSequence("30 min HIIT & Hills Ride: Live From LA")).toBe(
      "30 min HIIT & Hills Ride"
    );
    expect(removeLiveRideTitleSequence("30 min HIIT & Hills Ride: Live From Home")).toBe(
      "30 min HIIT & Hills Ride"
    );
    expect(removeLiveRideTitleSequence("30 min HIIT & Hills Ride: From Home")).toBe(
      "30 min HIIT & Hills Ride"
    );
  });
});

describe("findIndexOfTimeUnit", () => {
  it("should return the index of the last time unit seen", () => {
    expect(findIndexOfTimeUnit("30 min HIIT & Hills Ride")).toBe(3);
    expect(findIndexOfTimeUnit("30 sec HIIT & Hills Ride")).toBe(3);
    expect(findIndexOfTimeUnit("30 min 45 sec Tabata Ride")).toBe(10);
  });
});
