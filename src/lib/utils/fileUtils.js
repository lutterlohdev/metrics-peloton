/**
 * Converts a CSV to JSON
 * @param {string} csv CSV
 * @return {json} Parsed CSV as JSON
 */
export const csvToJson = (csv) => {
  const lines = csv.replace(/\n\r/g, '\n').split('\n');
  const result = [];
  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    // Fixes issue with quoted strings in CSV
    const filteredLine = lines[i].replace(/"[^"]+"/g, function (quotedString) {
      quotedString = quotedString.replace(/,/g, "");
      quotedString = quotedString.replace(/"/g, "");
      return quotedString;
    });
    const currentline = filteredLine.split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
};

/**
 * Determines if file is valid or not.
 * This could be done a lot cleaner and thoroughly.
 * @param {Array} data Array of data
 * @return {Boolean} result result of validation
 */
export const validateCSV = (data = []) => {
  if (data.length > 1) {
    const keys = Object.keys(data[0]);
    if (
      keys.find((value) => value === "Workout Timestamp") &&
      keys.find((value) => value === "Total Output") &&
      keys.find((value) => value === "Fitness Discipline")
    ) {
      console.debug("CSV has necessary columns");
      return true;
    }
  }
  console.error("CSV is not valid. Could not find 'Workout Timestamp', 'Total Output', and 'Fitness Discipline' as column headers.");
  throw new Error("CSV is not valid");
};

/**
 * Determines if distance is in miles or km.
 * I'm not thrilled with how this is done but needed a quick fix.
 * @param {Array} data Array of data
 * @return {String} "mi" or "km"
 */
export const getDistanceUnit = (data = []) => {
  let isKm = undefined;
  if (data.length > 1) {
    const keys = Object.keys(data[0]);
    isKm = keys.find((value) => value === "Distance (km)");
  }
  if (isKm) {
    return "km";
  }
  return "mi"; // Defaulting to miles
};

/**
 * Maps the given Peloton Workouts parsed CSV to JSON
 * @param {array} data parsed Peloton CSV Workout Data as JSON
 * @param {string} distanceUnit "mi" or "km"
 * @param {string} discipline Default: Cycling
 * @return {object} Workout Data
 */
export const mapCSVData = (data, distanceUnit = "mi") => {
  console.debug("Original Data Upload", data);
  const mappedData = {};
  const FITNESS_DISCIPLINE = "Fitness Discipline";
  
  // Remove undefined columns
  data = data.filter(effort => typeof effort[FITNESS_DISCIPLINE] === "string");
  
  // Unique Workout Types
  const workoutTypes = [... new Set(data.map(effort => effort[FITNESS_DISCIPLINE]))];

  // Map generic data for each workout
  workoutTypes.forEach((type) => {
    mappedData[type] = [];

    let workoutSpecificData = data.filter(effort => type === effort[FITNESS_DISCIPLINE]);
    workoutSpecificData.forEach((effort) => {
      const timestamp = effort["Workout Timestamp"];

      const workout = {};
      workout.instructor = effort["Instructor Name"] ? effort["Instructor Name"] : "None/Self";
      workout.duration = parseInt(effort["Length (minutes)"]);
      workout.type = effort["Type"] ? effort["Type"] : "Other (Lanebreak, etc)";
      workout.title = effort["Title"];
      workout.date = timestamp.substr(0, timestamp.indexOf(" "));

      // // Add all available metrics generically
      // // Copy all numeric and string fields except for known metadata columns
      // const skipFields = [
      //   "Workout Timestamp", "Instructor Name", "Length (minutes)", "Fitness Discipline", "Type", "Title", "Class Timestamp"
      // ];
      // Object.keys(effort).forEach((key) => {
      //   if (!skipFields.includes(key) && effort[key] !== "" && effort[key] != null) {
      //     // Try to parse as number, otherwise keep as string
      //     const num = Number(effort[key]);
      //     workout[key] = isNaN(num) ? effort[key] : num;
      //   }
      // });

      // Discipline-specific enhancements
      if (type === "Cycling") {
        enhanceCyclingData(effort, distanceUnit, workout);
      } else if (type === "Running") {
        enhanceRunningData(effort, distanceUnit, workout);
      } // Add more disciplines as needed

      mappedData[type].push(workout);
    });
  });
  
  console.debug("Mapped CSV Data", mappedData);
  return mappedData;
};

/**
 * Returns if ride title contains "just ride" or not
 * @param {string} title
 * @return {boolean}
 */
const isJustRide = (title) => {
  return title.toLowerCase().includes("just ride");
};


/**
 * Populates the workout object with data specific to cycling
 */
function enhanceCyclingData(effort, distanceUnit, workout) {
  const output = parseInt(effort["Total Output"]);
  const averageWatts = parseInt(effort["Avg. Watts"]);
  const distance = parseFloat(effort["Distance (" + distanceUnit + ")"]);
  if (output && averageWatts && distance && output > 0 && !isJustRide(effort["Title"])) {
    workout.output = output;
    workout.averageOutput = averageWatts;
    workout.averageCadence = effort["Avg. Cadence (RPM)"];
    workout.averageResistance = effort["Avg. Resistance"] ? effort["Avg. Resistance"].replace("%", "") : undefined;
    workout.distance = distance;
    workout.calories = parseFloat(effort["Calories Burned"]);
  }
  return workout;
}

/**
 * Populates the workout object with data specific to running
 */
function enhanceRunningData(effort, distanceUnit, workout) {
  const output = parseInt(effort["Total Output"]);
  const distance = parseFloat(effort["Distance (" + distanceUnit + ")"]);
  const avgPace = effort["Avg. Pace (min/mi)"] ? effort["Avg. Pace (min/mi)"] : effort["Avg. Pace (min/km)"];
  if (distance && distance > 0) {
    workout.distance = distance;
  }
  if (avgPace) {
    workout.averagePace = avgPace;
  }
  if(output && output > 0){
    workout.output = output;
  }
  workout.calories = parseFloat(effort["Calories Burned"]);
  workout.averageIncline = effort["Avg. Incline"];
  workout.averageSpeed = effort["Avg. Speed (mph)"] ? effort["Avg. Speed (mph)"] : effort["Avg. Speed (km/h)"];
  return workout;
}

