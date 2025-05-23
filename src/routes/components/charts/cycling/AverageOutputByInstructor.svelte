<script>
  import PolarArea from "../baseTypes/PolarArea.svelte";
  import {averageOutputByInstructor} from "$lib/store/workoutStore";
  import {getColorArrayBasedOnLength} from "$lib/utils/colorUtils";

  const getOutputs = (data) => {
    return data.map((item) => {
      return item.averageOutput;
    });
  };
  const getLabels = (data) => {
    return data.map((item) => {
      return item.instructor;
    });
  };

  const getDatasets = (instructorsData) => {
    const backgroundColor = getColorArrayBasedOnLength(instructorsData.length);
    const data = getOutputs(instructorsData);
    const labels = getLabels(instructorsData);
    return {
      datasets: [
        {
          data,
          backgroundColor,
          metadata: instructorsData
        }
      ],
      labels
    };
  };

  let datasets;
  let isError = false;
  let chartReference;
  const ERROR_MESSAGE = "There was an error generating the output over time chart.";

  try {
    datasets = getDatasets($averageOutputByInstructor);
  } catch (e) {
    isError = true;
    console.error(ERROR_MESSAGE, e);
  }

  averageOutputByInstructor.subscribe((value) => {
    try {
      if (chartReference) {
        chartReference.data = getDatasets(value);
        chartReference.update();
      }
    } catch (e) {
      isError = true;
      console.error(ERROR_MESSAGE, e);
    }
  });
</script>


<!-- Defensive: Only show chart if data is a non-empty array -->
{#if Array.isArray($averageOutputByInstructor) && $averageOutputByInstructor.length > 0}
  <section>
    <div class="section-wrapper">
      <div class="left">
        <h2>Average Output (During Rides) by Instructor</h2>
      </div>

      <div class="right">
        {#if isError}
          <p>{ERROR_MESSAGE}</p>
        {:else}
          <PolarArea title="Average Output by Instructor" {datasets} bind:chartReference />
        {/if}
      </div>
    </div>
  </section>
{/if}

<style>
  .section-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 10px;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
  }
  .left,
  .right {
    flex: 0 1 50%;
  }
  .left {
    margin: 0 auto;
    padding: 30px 20px;
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
