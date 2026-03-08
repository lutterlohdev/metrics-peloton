/**
 * Replaces all spaces with dashes and makes the string lowercase
 * @param {string} string
 * @return {string}
 */
export const convertStringToID = (string) => {
  return string.replace(/\s+/g, "-").toLowerCase();
};

/**
 * Strips title to the essential type
 * @param {string} title Workout Title
 * @param {boolean} removeWorkoutSuffix Should workout type be removed or not
 * @return {string} Trimmed title
 */
export const trimTitle = (title, removeWorkoutSuffix = false) => {
  // Remove time units
  let indexOfTextToRemove = findIndexOfTimeUnit(title);
  if (indexOfTextToRemove > 0) {
    title = title.substring(indexOfTextToRemove + 3).trim();
  } else {
    // Peloton has added rides with titles like "Extra 10: Climb Ride" which this needs to support
    indexOfTextToRemove = title.indexOf(":");
    if (indexOfTextToRemove > 0) {
      title = title.substring(indexOfTextToRemove + 1).trim();
    }
  }

  title = removeLiveRideTitleSequence(title);

  if (removeWorkoutSuffix) {
    title = removeSuffixes(title);
  }
  return title.trim();
};

/**
 * Removes text from titles like ": Live from Home" since they are inconsistent
 * @param {string} title
 * @returns string
 */
export const removeLiveRideTitleSequence = (title) => {
  return title.replace(/: Live (From Home|From LA)|: From Home/gi, "");
};

/**
 * Returns the last index of either "min" or "sec"
 * @param {string} inputString
 * @returns {number}
 */
export const findIndexOfTimeUnit = (inputString) => {
  const indexMin = inputString.toLowerCase().indexOf("min");
  const indexSec = inputString.toLowerCase().indexOf("sec");

  if (indexMin === -1 && indexSec === -1) {
    return -1; // Neither "min" nor "sec" found in the string
  } else if (indexMin === -1) {
    return indexSec; // Only "sec" found in the string
  } else if (indexSec === -1) {
    return indexMin; // Only "min" found in the string
  } else {
    return Math.max(indexMin, indexSec); // Both "min" and "sec" found, return the latest index of the occurrence
  }
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const removeSuffixes = (title) => {
  const suffixesToRemove = ["ride", "meditation", "stretch", "strength"];
  suffixesToRemove.forEach((suffix) => {
    let indexOfTextToRemove = title.toLowerCase().indexOf(suffix);
    if (indexOfTextToRemove > 0 && title.length - indexOfTextToRemove == suffix.length) {
      title = title.replace(capitalizeFirstLetter(suffix), "");
    }
  });
  return title;
};
