<script>
  import { preventDefault } from 'svelte/legacy';

  import {onMount} from "svelte";
  import {csvData, isError, distanceUnit, activeWorkoutType} from "$lib/store/store.js";
  import {csvToJson, getDistanceUnit, validateCSV} from "$lib/utils/fileUtils.js";

  let files = $state();
  // let errorStatus = false;
  let y = $state(0);

  onMount(async () => {
    const localStorageData = localStorage.getItem("savedData");

    if (localStorageData) {
      updateData(JSON.parse(localStorageData));
    }
  });

  const updateData = (json) => {
    console.debug("Raw JSON", json);
    localStorage.clear();
    csvData.set();
    isError.set(false);
    activeWorkoutType.set("Cycling"); // Default
    try {
      validateCSV(json);
      distanceUnit.set(getDistanceUnit(json)); // There's a better way to do this
      csvData.set(json);
      y = 0;
      localStorage.setItem("savedData", JSON.stringify(json));
    } catch (error) {
      console.error("An error occurred uploading the data", error);
      isError.set(true);
    }
  };

  const upload = () => {
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const json = csvToJson(e.target.result);
        updateData(json);
      };
      reader.readAsText(files[0]);
    }
  };
</script>

<svelte:window bind:scrollY={y} />

<section>
  <div class="section-wrapper">
    <div class="left">
      <h2>Instructions</h2>
      <ol>
        <li>
          Download your Workout CSV from your
          <a target="_blank" rel="noopener" href="https://members.onepeloton.com/profile/workouts"
            >Peloton profile</a
          > from a browser. It's not available via the app.
        </li>
        <li>Upload the CSV file</li>
      </ol>
    </div>
    <div class="right">
      <h2>CSV Upload</h2>
      <form onsubmit={preventDefault(upload)}>
        <label> CSV Upload: <input required type="file" bind:files /> </label>
        <div><button class="normal-button" type="submit">See My Metrics</button></div>
        <p>
          Note: Your data is not sent anywhere or stored remotely. This app runs in the browser and
          uses local storage on your device.
        </p>
      </form>
    </div>
  </div>
</section>

<style>
  section {
    position: relative;
  }
  .section-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 10px;
    display: flex;
  }
  .left,
  .right {
    flex: 0 1 50%;
  }
  ol > li {
    font-size: 18px;
    margin-bottom: 0.5em;
  }
  p {
    margin-top: 20px;
    font-style: italic;
    text-align: center;
  }
  form {
    text-align: center;
  }
  div {
    margin: 0 auto;
    max-width: 400px;
  }
  label {
    margin: 20px 0;
  }

  @media only screen and (max-width: 768px) {
    .section-wrapper {
      flex-direction: column;
    }
    .left {
      margin-bottom: 60px;
    }
    .right {
      padding: 0 20px;
    }
  }
</style>
