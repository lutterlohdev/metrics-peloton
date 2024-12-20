import {derived} from "svelte/store";
import {
  organizeRidesByDuration,
  getAverageOutputs,
  getAverageOutputByRideDuration,
  getOrganizedRidesSortedByOutput,
  getAverageOutputByWorkoutType,
  getAverageOutputByInstructor,
  getAverageTotalOutputByDurationAndInstructor
} from "$lib/utils/effortUtils";
import { filteredData, isError } from "./store";


 
/**
 * Get running data from main CSV map
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
* Store of average outputs of all runs
*/
export const averageOutputs = derived(runningData, ($runningData) =>
 getAverageOutputs($runningData)
);

/**
* Store of the average incline for all filtered runs
*/
export const averageIncline = derived(runningData, ($runningData) =>
 getAverageIncline($runningData)
);

/**
* Store of the average outputs organized by ride type
*/
export const averageOutputByRideType = derived(runningData, ($runningData) =>
getAverageOutputByWorkoutType($runningData)
);

/**
* Store of the average outputs by instructor
*/
export const averageOutputByInstructor = derived(runningData, ($runningData) =>
 getAverageOutputByInstructor($runningData)
);

/**
* Store of all filtered runs organized by ride duration
*/
export const organizedRunsByDuration = derived(runningData, ($runningData) => {
 try {
   return organizeRidesByDuration($runningData);
 } catch (e) {
   isError.set(true);
   console.error("Could not parse data to organize the runs by length");
   return {};
 }
});

/**
* Store of average outputs by duration
*/
export const averageOutputsByDuration = derived(
 organizedRunsByDuration,
 ($organizedRunsByDuration) => getAverageOutputByRideDuration($organizedRunsByDuration)
);

/**
* Store of the runs sorted by output within keys of duration
*/
export const organizedRunsSortedByOutput = derived(
 organizedRunsByDuration,
 ($organizedRunsByDuration) => {
   try {
     return getOrganizedRidesSortedByOutput($organizedRunsByDuration);
   } catch (e) {
     isError.set(true);
     console.error("Could not parse data to organize the runs sorted by output");
     return {};
   }
 }
);

export const averageTotalOutputByDurationAndInstructor = derived(
 organizedRunsByDuration,
 ($organizedRunsByDuration) => {
   try {
     return getAverageTotalOutputByDurationAndInstructor($organizedRunsByDuration);
   } catch (e) {
     console.error("Could not parse data");
     return {};
   }
 }
);