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
import { filteredData, isError } from "./store";


 
/**
 * Get cycling data from main CSV map
 */
export const runningData = derived(
  [filteredData],
  ([$filteredData]) => {
    if (Object.keys($filteredData).length > 0) {
      // Ensure Running data exists and return it
      return $filteredData["Running"] ? $filteredData["Running"] : [];
    }
    return [];
  }
);


/**
* Store of average outputs of all rides
*/
export const averageOutputs = derived(runningData, ($runningData) =>
 getAverageOutputs($runningData)
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
export const averageCadence = derived(runningData, ($runningData) =>
 getAverageCadence($runningData)
);

/**
* Store of the average resistances for all filtered rides
*/
export const averageResistance = derived(runningData, ($runningData) =>
 getAverageResistance($runningData)
);

/**
* Store of the average outputs organized by ride type
*/
export const averageOutputByRideType = derived(runningData, ($runningData) =>
 getAverageOutputByRideType($runningData)
);

/**
* Store of the average outputs by instructor
*/
export const averageOutputByInstructor = derived(runningData, ($runningData) =>
 getAverageOutputByInstructor($runningData)
);

/**
* Store of all filtered rides organized by ride duration
*/
export const organizedRidesByDuration = derived(runningData, ($runningData) => {
 try {
   return organizeRidesByDuration($runningData);
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