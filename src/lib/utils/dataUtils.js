/**
 * Returns the average of a number value within the objects of an array
 * @param {array} array Array of objects
 * @param {string} key Attribute pointing to a number within the objects of an array to get the average of
 * @return {number} Average
 */
export const getAverageFromArray = (array, key) => {
  if (array.length === 0) {
    return 0;
  }
  const sum = array.reduce((accumulator, data) => {
    const value = data[key];
    return value != null ? accumulator + value : accumulator;
  }, 0);
  return Math.round(sum / array.length);
};

/**
 * Sorts an array of objects based on a given object attribute
 * @param {array} array Array of objects
 * @param {string} attribute Attribute pointing to a numerical value within the objects
 * @return {array}
 */
export const sortArrayByAttributeInObject = (array, attribute) => {
  // Concat so we dont change the original
  return array
    .concat()
    .sort((a, b) => {
      return a[attribute] - b[attribute];
    })
    .reverse();
  // Reverse will return from highest to lowest
};

/**
 * Slices an array by a given max
 * @param {array} array
 * @param {number} max Resulting array length
 * @return {array} Sliced Array
 */
export const sliceArrayByGivenMax = (array, max) => {
  const arrayLength = array.length;

  if (max < arrayLength) {
    array = array.slice(arrayLength - max, arrayLength);
  }

  return array;
};

/**
 * Extracts an array of unique values contained within an attribute contained within each object in an array.
 * @param {array} array Array of objects
 * @param {string} attribute Attribute to get unique values from
 * @return {array} Unique Values
 */
export const getUniqueValuesFromDataArrayByAttribute = (array, attribute) => {
  const values = [
    ...new Set(
      array
        .filter((item) => item[attribute] != "") // Needed to filter out scenic rides without an instructor
        .map((item) => {
          if (item[attribute]) {
            return item[attribute];
          }
          console.error(
            "Attribute (" + attribute + ") for the following item returned null or undefined",
            item
          );
          throw new Error("Error getting values for '" + attribute + "'");
        })
    )
  ];
  return values;
};

/**
 * Returns the sum of a number value within the objects of an array
 * @param {array} array Array of objects
 * @param {string} key Attribute pointing to a number within the objects of an array to get the sum of
 * @return {number} Sum
 */
export const getTotalByAttribute = (array, key) => {
  if (!array) {
    return 0;
  }
  const sum = array.reduce((accumulator, element) => {
    const value = element[key];
    return value ? accumulator + value : accumulator;
  }, 0);
  return Math.round(sum);
};
