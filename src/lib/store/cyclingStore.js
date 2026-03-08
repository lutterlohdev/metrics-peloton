import {derived} from "svelte/store";
import {
  organizeRidesByDuration,
  getAverageOutputs,
  getAverageOutputByRideDuration,
  getAverageCadence,
  getAverageResistance,
  getOrganizedRidesSortedByOutput,
  getAverageOutputByRideType,
  getAverageOutputByInstructor,
  getAverageTotalOutputByDurationAndInstructor
} from "$lib/utils/effortUtils";
import {filteredData, isError} from "./store";

/**
 * Get cycling data from main CSV map
 */
export const cyclingData = derived([filteredData], ([$filteredData]) => {
  if (Object.keys($filteredData).length > 0) {
    // Ensure Cycling data exists and return it
    return $filteredData["Cycling"] ? $filteredData["Cycling"] : [];
  }
  return [];
});

/**
 * Store of filtered FTP ride data (`activeData` inversely fitlered by `ftpTestFilter`)
 */
export const ftpTestRides = derived([cyclingData], ([$cyclingData]) => {
  let ftpRides = $cyclingData.filter((ride) => ride.title.includes("FTP Test Ride"));
  console.debug("FTP Rides", ftpRides);
  return ftpRides;
});

/**
 * Store of average outputs of all rides
 */
export const averageOutputs = derived(cyclingData, ($cyclingData) =>
  getAverageOutputs($cyclingData)
);

/**
 * Store of all FTP test ride average outputs
 */
export const ftpAverageOutputs = derived(ftpTestRides, ($ftpTestRides) =>
  getAverageOutputs($ftpTestRides, "watts")
);

/**
 * Store of the average cadences for all filtered rides
 */
export const averageCadence = derived(cyclingData, ($cyclingData) =>
  getAverageCadence($cyclingData)
);

/**
 * Store of the average resistances for all filtered rides
 */
export const averageResistance = derived(cyclingData, ($cyclingData) =>
  getAverageResistance($cyclingData)
);

/**
 * Store of the average outputs organized by ride type
 */
export const averageOutputByRideType = derived(cyclingData, ($cyclingData) =>
  getAverageOutputByRideType($cyclingData)
);

/**
 * Store of the average outputs by instructor
 */
export const averageOutputByInstructor = derived(cyclingData, ($cyclingData) =>
  getAverageOutputByInstructor($cyclingData)
);

/**
 * Store of all filtered rides organized by ride duration
 */
export const organizedRidesByDuration = derived(cyclingData, ($cyclingData) => {
  try {
    return organizeRidesByDuration($cyclingData);
  } catch (e) {
    isError.set(true);
    console.error("Could not parse data to organize the rides by length");
    return {};
  }
});

/**
 * Store of average outputs by duration
 */
export const averageOutputsByDuration = derived(
  organizedRidesByDuration,
  ($organizedRidesByDuration) => getAverageOutputByRideDuration($organizedRidesByDuration)
);

/**
 * Store of the rides sorted by output within keys of duration
 */
export const organizedRidesSortedByOutput = derived(
  organizedRidesByDuration,
  ($organizedRidesByDuration) => {
    try {
      return getOrganizedRidesSortedByOutput($organizedRidesByDuration);
    } catch (e) {
      isError.set(true);
      console.error("Could not parse data to organize the rides sorted by output");
      return {};
    }
  }
);

export const averageTotalOutputByDurationAndInstructor = derived(
  organizedRidesByDuration,
  ($organizedRidesByDuration) => {
    try {
      return getAverageTotalOutputByDurationAndInstructor($organizedRidesByDuration);
    } catch (e) {
      console.error("Could not parse data");
      return {};
    }
  }
);
