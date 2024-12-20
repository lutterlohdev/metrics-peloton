import {writable, derived} from "svelte/store";
import {mapCSVData} from "$lib/utils/fileUtils";
import {subtractNMonthsFromDate, getReadableDate} from "$lib/utils/dateUtils";
import {getUniqueValuesFromDataArrayByAttribute, sortArrayByAttributeInObject} from "$lib/utils/dataUtils";
import {filterSameDayWorkouts, getClassesTakenByInstructor, filterWorkoutsByDate, filterByTitle, getUniqueWorkoutTypes} from "$lib/utils/effortUtils";
import { getTotalByAttribute } from "$lib/utils/dataUtils";

/**
 * Store boolean for whether or not an error has occurred.
 */
export const isError = writable(false);

/**
 * Store for uploaded CSV data
 */
export const csvData = writable();

/**
 * Initialized as empty. Eventually containes `startDate` and `endDate`
 */
export const dateFilter = writable({});

export const activeWorkoutType = writable("Cycling");
/**
 * Distance unit. Defaults to miles.
 */
export const distanceUnit = writable("mi");

/**
 * Store for option of whether or not to show same day rides.
 */
export const showSameDayWorkouts = writable(false);

/**
 * Store for the strings from which to filter workout types based on workout title.
 * Initialized with ride types that would adversely affect calculating averages
 */
export const titleFilters = writable([
  "Intervals & Arms",
  "Cool Down",
  "Warm Up",
  "Recovery",
  "Low Impact",
  "Bike Bootcamp: Upper Body",
  "Just"
]);

/**
 * Store containing the parsed CSV data
 */
export const mappedCSVData = derived([csvData, distanceUnit], ([$csvData, $distanceUnit]) => {
  let data = $csvData;
  if ($csvData) {
    const TIMESTAMP_COLUMN = "Workout Timestamp";
    // Filter empty records
    data = data.filter(workout => typeof workout[TIMESTAMP_COLUMN] === "string" && workout[TIMESTAMP_COLUMN].length > 0);
    console.log("Last Record", data[data.length -1]);
    // Set date filter
    const endDate = getReadableDate(data[data.length - 1][TIMESTAMP_COLUMN]);
    const startDate = subtractNMonthsFromDate(endDate, 9);
    dateFilter.set({startDate, endDate});

    // Return Mapped Data
    return mapCSVData(data, $distanceUnit);
  }
  return {};
});

export const filteredData = derived(
  [mappedCSVData, showSameDayWorkouts, dateFilter, titleFilters],
  ([$mappedCSVData, $showSameDayWorkouts, $dateFilter, $titleFilters]) => {
    let data = {};
    // For each workout type, filter the array of workouts
    for (const key of Object.keys($mappedCSVData)) {
      let workouts = $mappedCSVData[key];

      // Filter same day workouts
      if (workouts.length > 0) {
        if (!$showSameDayWorkouts) {
          workouts = filterSameDayWorkouts(workouts);
        }
      }
      // Filter workouts by date
      workouts = filterWorkoutsByDate(workouts, $dateFilter.startDate, $dateFilter.endDate);

      // Filter rides by title
      workouts = filterByTitle(workouts, $titleFilters);

      // Set the result back to the main object
      data[key] = workouts;
    }
    console.debug("Filtered Data", data);
    return data;
  }
);

/**
 * Store with the unique ride types contained within the active data set
 */
export const workoutTypes = derived([mappedCSVData, activeWorkoutType], ([$mappedCSVData, $activeWorkoutType]) => {
  return getUniqueWorkoutTypes($mappedCSVData[$activeWorkoutType])
});

export const activeData = derived(
  [filteredData, activeWorkoutType],
  ([$filteredData, $activeWorkoutType]) => {
    console.debug("Active Data for " + $activeWorkoutType, $filteredData[$activeWorkoutType]);
    return $filteredData[$activeWorkoutType];
  }
);


export const classesTakenByInstructor = derived(
  activeData,
  ($activeData) => {
    return getClassesTakenByInstructor($activeData);
  }
);

export const classesTakenByType = derived(
  activeData,
  ($activeData) => {
    if (!$activeData){
      return [];
    }
    let classTypesWithCounts = [];
    const classTypes = getUniqueValuesFromDataArrayByAttribute($activeData, "type");
    classTypes.forEach(type => {
      let count = $activeData.filter(workout => workout.type === type).length;
      classTypesWithCounts.push({type, count});
    });
    classTypesWithCounts = sortArrayByAttributeInObject(classTypesWithCounts, "count");
    console.debug("Classes Taken By Type", classTypesWithCounts);
    return classTypesWithCounts;
  }
)

/**
* Store of total calories burned in all filtered workouts
*/
export const totalCalories = derived(activeData, ($activeData) =>
 getTotalByAttribute($activeData, "calories")
);

/**
* Store of total minutes spent of all filtered workouts
*/
export const totalMinutes = derived(activeData, ($activeData) =>
 getTotalByAttribute($activeData, "duration")
);

/**
 * Store of total distance of all filtered rides
 */
export const totalDistance = derived(activeData, ($activeData) => 
  getTotalByAttribute($activeData, "distance")
);