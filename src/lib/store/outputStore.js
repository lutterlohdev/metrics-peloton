import { activeData, isError } from "./store";
import {derived} from "svelte/store";
import {
    getAverageOutputs,
    getAverageOutputByWorkoutType
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