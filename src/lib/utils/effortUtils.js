import {
  getAverageFromArray,
  sortArrayByAttributeInObject,
  getUniqueValuesFromDataArrayByAttribute
} from "./dataUtils";
import { getColorBasedOnArrayLengthAndIndex } from "./colorUtils";
import { isDateSameOrAfterGivenDate, isDateSameOrBeforeGivenDate } from "./dateUtils";
import { trimTitle } from "./stringUtils";

// --- GENERIC WORKOUT UTILS ---

/**
 * Organize workouts by duration (generic, not just rides)
 */
export const organizeWorkoutsByDuration = (workoutData) => {
  console.debug("organizedWorkoutsByDuration Input", workoutData);
  const workouts = {};
  const uniqueDurations = [
    ...new Set(
      workoutData.map((w) => {
        if (w.duration) return w.duration;
        throw new Error("One or more workouts did not include duration.");
      })
    )
  ];
  console.debug("Unique Durations", uniqueDurations);

  uniqueDurations.forEach((duration) => {
    workouts[duration.toString()] = workoutData.filter((w) => w.duration === duration);
  });
  console.debug("organizedWorkoutsByDuration Output", workouts);
  return workouts;
};

/**
 * Get average outputs for all workouts
 */

// Generic: returns a single average value for a set of workouts
export const getAverageOutputs = (workouts) => {
  if (!workouts || workouts.length === 0) return 0;
  const outputs = workouts.map((w) =>
    w.output != null ? Number(w.output) : Number(w["Total Output"]) || 0
  );
  return getAverageFromArray(outputs);
};

/**
 * Get average of a specific metric for all workouts
 */
export const getAverageMetric = (workouts, metric) => {
  if (!workouts || workouts.length === 0) return 0;
  const values = workouts.map((w) => Number(w[metric]) || 0);
  return getAverageFromArray(values);
};

/**
 * Get average output by duration
 */
export const getAverageOutputByDuration = (organizedWorkouts) => {
  const result = {};
  Object.keys(organizedWorkouts).forEach((duration) => {
    result[duration] = getAverageOutputs(organizedWorkouts[duration]);
  });
  return result;
};

/**
 * Get average output by workout type
 */
export const getAverageOutputByType = (workouts) => {
  const byType = {};
  workouts.forEach((w) => {
    const type = w.type || w["Type"] || "Unknown";
    if (!byType[type]) byType[type] = [];
    byType[type].push(w);
  });
  const result = {};
  Object.keys(byType).forEach((type) => {
    result[type] = getAverageOutputs(byType[type]);
  });
  return result;
};

/**
 * Get average output by instructor
 */
export const getAverageOutputByInstructor = (workouts) => {
  const byInstructor = {};
  workouts.forEach((w) => {
    const instructor = w["Instructor Name"] || w.instructor || "Unknown";
    if (!byInstructor[instructor]) byInstructor[instructor] = [];
    byInstructor[instructor].push(w);
  });
  const result = {};
  Object.keys(byInstructor).forEach((instructor) => {
    result[instructor] = getAverageOutputs(byInstructor[instructor]);
  });
  return result;
};

/**
 * Get average total output by duration and instructor
 */
export const getAverageTotalOutputByDurationAndInstructor = (organizedWorkouts) => {
  const result = {};
  Object.keys(organizedWorkouts).forEach((duration) => {
    const byInstructor = {};
    organizedWorkouts[duration].forEach((w) => {
      const instructor = w["Instructor Name"] || w.instructor || "Unknown";
      if (!byInstructor[instructor]) byInstructor[instructor] = [];
      byInstructor[instructor].push(w);
    });
    result[duration] = {};
    Object.keys(byInstructor).forEach((instructor) => {
      result[duration][instructor] = getAverageOutputs(byInstructor[instructor]);
    });
  });
  return result;
};

/**
 * Get workouts sorted by output within each duration
 */
export const getOrganizedWorkoutsSortedByOutput = (organizedWorkouts) => {
  const result = {};
  Object.keys(organizedWorkouts).forEach((duration) => {
    result[duration] = organizedWorkouts[duration].slice().sort((a, b) => {
      const aOut = Number(a.output || a["Total Output"]) || 0;
      const bOut = Number(b.output || b["Total Output"]) || 0;
      return bOut - aOut;
    });
  });
  console.log("Sorted organized rides by output", result)
  return result;
};

/**
 * Filters Peloton Workout data by the given filters on titles
 * @param {array} workouts Array of Peloton workout data
 * @param {array} filters Array of strings to filter titles on
 * @return {array} Filtered Peloton Workout data
 */

export const filterByTitle = (workouts, filters) => {
  // Defensive: always return an array, and only filter if workouts is an array
  if (!Array.isArray(workouts) || !workouts.length) {
    return [];
  }
  const filteredWorkouts = workouts.filter((workout) => {
    if (!workout || !workout.title) {
      return false;
    }
    let isFilteredOut = false;
    filters.forEach((filter) => {
      if (workout.title.includes(filter)) {
        // default is to filter out matching
        isFilteredOut = true;
      }
    });
    return !isFilteredOut;
  });
  return filteredWorkouts;
};

/**
 * Filters Workouts By Date
 * @param {array} workouts Peloton workout data
 * @param {object} dateFilters Object containing `startDate` and `endDate`
 * @return {array} filtered data
 */
export const filterWorkoutsByDate = (workouts, startDate, endDate) => {
  if (
    startDate &&
    endDate && 
    workouts.length > 2
  ) {
    const originalLength = workouts.length;
    let filteredWorkouts = workouts.filter((ride) => {
      return (
        isDateSameOrAfterGivenDate(ride.date, startDate) &&
        isDateSameOrBeforeGivenDate(ride.date, endDate)
      );
    });
    console.debug(`${filteredWorkouts.length} out of ${originalLength} workouts remain after applying date filter ${startDate}|${endDate}`);
    return filteredWorkouts;
  }
  return workouts;
};

/**
 * Returns an array of ride objects that begin with the given duration
 * @param {array} rideData Peloton ride data
 * @param {string} duration duration of rides to return (ie. 30)
 * @return {array} Array of ride objects that begin with the given duration
 */
export const getRidesByDuration = (rideData, duration) => {
  return rideData.filter((ride) => ride.title.startsWith(duration));
};

/**
 * Returns an object containing ride data mapped by duration keys
 * @param {array} rideData Peloton ride data
 * @return {object} An object with keys that match the unique ride durations
 */
export const organizeRidesByDuration = (rideData) => {
  const rides = {};

  const uniqueRideDurations = [
    ...new Set(
      rideData.map((ride) => {
        if (ride.duration) {
          return ride.duration;
        }
        throw new Error("One or more rides did not include duration.");
      })
    )
  ];

  uniqueRideDurations.forEach((duration) => {
    rides[duration.toString()] = getRidesByDuration(rideData, duration);
  });

  return rides;
};

/**
 * Parses workout titles to get an array of workout types
 * @param {array} workouts Peloton workout data
 * @return {array} Unique ride types
 */
export const getUniqueWorkoutTypes = (workouts) => {
  if (!workouts) {
    return [];
  }
  // Relies on titles matching similar to "45 Min Tabata Ride" format
  const uniqueTypes = [
    ...new Set(
      workouts.map((ride) => {
        return trimTitle(ride.title, true);
      })
    )
  ];

  return uniqueTypes;
};

/**
 * Returns a best workout by output
 * @param {array} workouts Peloton workouts data
 * @return {object} Best workout by output
 */
export const getHighestOutputWorkout = (workouts) => {
  if (workouts && workouts.length > 0) {
    const bestTotalWork = Math.max(...workouts.map((workout) => workout.output), 0);
    const bestWorkout = workouts.find(function (workout) {
      return workout.output == bestTotalWork;
    });

    return bestWorkout;
  }
  throw new Error("Bad input");
};

/**
 * Returns a longest workout.
 * WARNING: This will only return the last workout of the highest duration in the array.
 * @param {array} workouts Peloton workouts data
 * @return {object} Best workout by length
 */
 export const getLongestWorkout = (workouts) => {
  if (workouts && workouts.length > 0) {
    const longestWorkoutDuration = Math.max(...workouts.map((workout) => workout.duration), 0);
    const longestWorkout = workouts.find(function (workout) {
      return workout.duration == longestWorkoutDuration;
    });

    return longestWorkout;
  }
  throw new Error("Bad input");
};

/**
 * Returns an object of duration keys with a best ride by output for each
 * @param {array} rideData Peloton ride data
 * @return {object}
 */
export const getHighestOutputRidesByDuration = (rideData) => {
  const bestRides = [];
  if (rideData) {
    Object.keys(rideData).forEach((key) => {
      const ride = getHighestOutputWorkout(rideData[key]);
      bestRides.push(ride);
    });
  }
  return bestRides;
};

export const energy = {
  WATTS: "watts",
  KILOJOULES: "kj"
};

/**
 * Get average outputs for all given rides
 * @param {array} rideData Peloton ride data
 * @param {energy} units kj (default) or watts
 * @return {array}  Average Outputs
 */

/**
 * Gets an array of dates that had multiple workouts
 * @param {array} workouts Peloton workout data
 * @return {array} Dates containing multiple workouts
 */
export const getDatesWithMultipleWorkouts = (workouts) => {
  const datesWithMultipleWorkouts = [];
  const uniqueDates = getUniqueValuesFromDataArrayByAttribute(workouts, "date");
  // Determine which dates have multiple rides
  uniqueDates.forEach((date) => {
    const ridesOnSpecificDate = workouts.filter((workout) => {
      return workout.date === date;
    });

    if (ridesOnSpecificDate.length > 1) {
      datesWithMultipleWorkouts.push(date);
    }
  });
  return datesWithMultipleWorkouts;
};

/**
 * Filters out all but the highest output (or longest) workout for workout that occurred on the same day.
 * @param {array} workouts Peloton workout data
 * @return {array} Peloton workout data
 */
export const filterSameDayWorkouts = (workouts) => {
  if (workouts) {
    const datesWithMultipleWorkouts = getDatesWithMultipleWorkouts(workouts);

    // Find best workout for days with multiple workouts
    datesWithMultipleWorkouts.forEach((date) => {
      const workoutsOnSpecificDay = workouts.filter((workout) => {
        return date == workout.date;
      });
      
      let bestWorkout;
      
      if (workoutsOnSpecificDay.some(workout => workout.output)){
        bestWorkout = getHighestOutputWorkout(workoutsOnSpecificDay);
      } else {
        bestWorkout = getLongestWorkout(workoutsOnSpecificDay);
      }

      // Remove best ride from ones to remove
      const index = workoutsOnSpecificDay.indexOf(bestWorkout);
      workoutsOnSpecificDay.splice(index, 1);

      // Remove all rides for that day
      workoutsOnSpecificDay.forEach((workoutToRemove) => {
        const index = workouts.indexOf(workoutToRemove);
        workouts.splice(index, 1);
      });
    });
  }

  return workouts;
};

/**
 * Returns average output by duration lengths
 * @param {array} rideData Peloton ride data
 * @return {object} Object with keys (duration) containing information about the average output for each
 */
export const getAverageOutputByRideDuration = (rideData) => {
  const averages = [];
  const durations = Object.keys(rideData);
  for (const [i, duration] of durations.entries()) {
    const average = {};
    const rides = rideData[duration];
    average["value"] = getAverageFromArray(rides, "output");
    average["color"] = getColorBasedOnArrayLengthAndIndex(durations.length, i);
    average["duration"] = duration;
    averages.push(average);
  }
  return averages;
};

/**
 * Gets a sorted array of instructors and the number of classes taken with each
 * @param {array} rideData Peloton ride data
 * @return {array}
 */
export const getClassesTakenByInstructor = (rideData) => {
  let classesTakenByInstructor = [];
  try {
    const uniqueInstructors = getUniqueValuesFromDataArrayByAttribute(rideData, "instructor");

    uniqueInstructors.forEach((instructor) => {
      if (instructor !== "") {
        const value = {};
        value.instructor = instructor;
        value.count = rideData.filter((ride) => ride.instructor === instructor).length;
        classesTakenByInstructor.push(value);
      }
    });

    // Sort by count
    classesTakenByInstructor = sortArrayByAttributeInObject(classesTakenByInstructor, "count");
  } catch (e) {
    console.error("Non-Fatal Error: Could not get classes taken by instructor", e);
  }

  return classesTakenByInstructor;
};

/**
 * Gets the average cadence for each ride in the given array of data
 * @param {array} rideData Peloton ride data
 * @return {array} Average cadences alongside date
 */
export const getAverageCadence = (rideData) => {
  const cadences = [];
  rideData.forEach((ride) => {
    const cadence = {};
    cadence["average"] = ride.averageCadence;
    cadence["createdAt"] = ride.date;
    cadence["title"] = ride.title;
    cadences.push(cadence);
  });

  return cadences;
};

/**
 * Gets the average resistance for each ride in the given array of data
 * @param {array} rideData Peloton ride data
 * @return {array} Average resistances alongside date
 */
export const getAverageResistance = (rideData) => {
  const resistances = [];
  rideData.forEach((ride) => {
    const resistance = {};
    resistance["average"] = ride.averageResistance;
    resistance["createdAt"] = ride.date;
    resistance["title"] = ride.title;
    resistances.push(resistance);
  });
  return resistances;
};

/**
 * Returns an object with keys (duration) containing rides sorted by output
 * @param {array} rideData Peloton ride data
 * @return {object}
 */
export const getOrganizedRidesSortedByOutput = (rideData) => {
  const result = {};

  Object.keys(rideData).forEach(duration => {
    result[duration] = sortArrayByAttributeInObject(rideData[duration], "output");
  });
  return result;
};

/**
 * Returns a sorted array of ride types alongside each's average output
 * @param {array} rideData Peloton ride data
 * @return {array} Sorted array of objects containing ride type and average output
 */
export const getAverageOutputByRideType = (rideData) => {
  const groupedRides = groupBy(rideData, "type");
  const averageOutputs = [];
  Object.keys(groupedRides).forEach((key) => {
    const average = getAverageFromArray(groupedRides[key], "averageOutput");
    const result = {};
    result["type"] = key;
    result["averageOutput"] = average;
    averageOutputs.push(result);
  });
  const sortedAverageOutputs = sortArrayByAttributeInObject(averageOutputs, "averageOutput");
  return sortedAverageOutputs;
};

/**
 * Returns a sorted array of average outputs by instructor
 * @param {array} rideData Peloton ride data
 * @return {array} Sorted array of objects containing average output by instructor
 */


/**
 * Groups objects in an array by a given attribute
 * Source: https://stackoverflow.com/questions/14696326/break-array-of-objects-into-separate-arrays-based-on-a-property
 * @param {array} arr array of objects
 * @param {string} property attribute within objects to group by
 * @return {object}
 */
const groupBy = (arr, property) => {
  return arr.reduce(function (result, x) {
    if (!result[x[property]]) {
      result[x[property]] = [];
    }
    result[x[property]].push(x);
    return result;
  }, {});
};