import { activeData, isError } from "./store";
import {derived} from "svelte/store";
import {
    getAverageOutputs,
    getAverageOutputByWorkoutType,
    organizeEffortsByDuration,
  } from "$lib/utils/effortUtils";

  
/**
* Store of average outputs of all rides
*/
export const averageOutputs = derived(activeData, ($activeData) =>
getAverageOutputs($activeData)
);

/**
* Store of the average outputs organized by ride type
*/
export const averageOutputByWorkoutType = derived(activeData, ($activeData) =>
 getAverageOutputByWorkoutType($activeData)
);

/**
* Store of all filtered efforts organized by duration
*/
export const organizedEffortsByDuration = derived(activeData, ($activeData) => {
 try {
    let efforts = organizeEffortsByDuration($activeData);
    // filter out any efforts that dont have an output value
    Object.keys(efforts).forEach((key) => {
      efforts[key] = efforts[key].filter((effort) => effort.output > 0);
    });
   return efforts;
 } catch (e) {
   isError.set(true);
   console.error("Could not parse data to organize the runs by length");
   return {};
 }
});