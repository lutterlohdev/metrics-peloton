<script>
  import DoughnutChart from "../baseTypes/DoughnutChart.svelte";
  import {getColorArrayBasedOnLength} from "$lib/utils/colorUtils";
  import {classesTakenByInstructor} from "$lib/store/store.js";

  const getCounts = (data) => {
    return data.map((item) => {
      return item.count;
    });
  };
  const getCountsLabels = (data) => {
    return data.map((item) => {
      return item.instructor;
    });
  };

  const getDatasets = (instructorsData) => {
    const backgroundColor = getColorArrayBasedOnLength(instructorsData.length);
    const data = getCounts(instructorsData);
    const labels = getCountsLabels(instructorsData);
    return {
      datasets: [
        {
          data,
          backgroundColor
        }
      ],
      labels
    };
  };

  let datasets = $state();
  let isError = $state(false);
  let chartReference = $state();
  let data = $classesTakenByInstructor;
  const ERROR_MESSAGE = "There was an error generating the output over time chart.";

  try {
    datasets = getDatasets(data);
  } catch (e) {
    isError = true;
    console.error(ERROR_MESSAGE, e);
  }

  classesTakenByInstructor.subscribe((data) => {
    if (data) {
      try {
        if (chartReference) {
          chartReference.data = getDatasets(data);
          chartReference.update();
        }
      } catch (e) {
        isError = true;
        console.error(ERROR_MESSAGE, e);
      }
    } else {
      console.debug("Active Workout Not Supported for Instructor Classes Graph")
    }
  });
</script>

<!-- Show this for any workout type if data exists for that workout type-->
{#if data}
<section>
  <div class="section-wrapper">
    <div class="left">
      <h2>Classes Taken Per Instructor</h2>
    </div>

    <div class="right">
      {#if isError}
        <p>{ERROR_MESSAGE}</p>
      {:else}
        <DoughnutChart title="Classes Taken Per Instructor" {datasets} bind:chartReference />
      {/if}
    </div>
  </div>
</section>
{/if}

<style>
  .section-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 10px 0;
    display: flex;
    align-items: center;
  }
  .left,
  .right {
    flex: 0 1 50%;
  }
  .left {
    margin: 0 auto;
    padding: 30px 20px;
  }
  h2 {
    text-align: center;
  }
  @media only screen and (max-width: 768px) {
    .section-wrapper {
      flex-direction: column;
    }
    .left {
      padding: 0;
    }
  }
</style>
