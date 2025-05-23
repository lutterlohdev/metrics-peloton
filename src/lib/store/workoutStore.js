import { derived } from "svelte/store";
import { filteredData, activeData, isError } from "./store";
import {
  organizeWorkoutsByDuration,
  getAverageOutputs,
  getAverageOutputByDuration,
  getAverageMetric,
  getOrganizedWorkoutsSortedByOutput,
  getAverageOutputByType,
  getAverageOutputByInstructor,
  getAverageTotalOutputByDurationAndInstructor
} from "$lib/utils/effortUtils";

/**
 * Get generic workout data from main CSV map
 */
export const workoutData = derived(
  [activeData],
  ([$activeData]) => {
    console.log("Active Data", $activeData);
    if (Object.keys($activeData).length > 0) {
      // Combine all workout types into a single array
      return $activeData.flat();
    }
    return [];
  }
);

/**
 * Store of average outputs of all workouts
 */
export const averageOutputs = derived(workoutData, ($workoutData) =>
  getAverageOutputs($workoutData)
);

/**
 * Store of the average of a specific metric for all filtered workouts
 * Usage: averageMetric('cadence'), averageMetric('resistance'), etc.
 */
export const averageMetric = (metric) => derived(workoutData, ($workoutData) =>
  getAverageMetric($workoutData, metric)
);

/**
 * Store of the average outputs organized by workout type
 */
export const averageOutputByType = derived(workoutData, ($workoutData) =>
  getAverageOutputByType($workoutData)
);

/**
 * Store of the average outputs by instructor
 */
export const averageOutputByInstructor = derived(workoutData, ($workoutData) =>
  getAverageOutputByInstructor($workoutData)
);

/**
 * Store of all filtered workouts organized by duration
 */
export const organizedWorkoutsByDuration = derived(workoutData, ($workoutData) => {
  try {
    return organizeWorkoutsByDuration($workoutData);
  } catch (e) {
    isError.set(true);
    console.error("Could not parse data to organize the workouts by length");
    return {};
  }
});

/**
 * Store of average outputs by duration
 */
export const averageOutputsByDuration = derived(
  organizedWorkoutsByDuration,
  ($organizedWorkoutsByDuration) => getAverageOutputByDuration($organizedWorkoutsByDuration)
);

/**
 * Store of the workouts sorted by output within keys of duration
 */
export const organizedWorkoutsSortedByOutput = derived(
  organizedWorkoutsByDuration,
  ($organizedWorkoutsByDuration) => {
    try {
      return getOrganizedWorkoutsSortedByOutput($organizedWorkoutsByDuration);
    } catch (e) {
      isError.set(true);
      console.error("Could not parse data to organize the workouts sorted by output");
      return {};
    }
  }
);

export const averageTotalOutputByDurationAndInstructor = derived(
  organizedWorkoutsByDuration,
  ($organizedWorkoutsByDuration) => {
    try {
      return getAverageTotalOutputByDurationAndInstructor($organizedWorkoutsByDuration);
    } catch (e) {
      console.error("Could not parse data");
      return {};
    }
  }
);
