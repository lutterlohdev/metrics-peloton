<script>
  import LineChart from "../baseTypes/LineChart.svelte";
  import {averageOutputs} from "$lib/store/workoutStore";
  import {activeWorkoutType } from "$lib/store/store";
  import {getPlotPointsByDate} from "$lib/utils/chartUtils";

  const CHART_TITLE = "Average Output Per Minute";
  const getDatasets = (data) => {
    const averageData = getPlotPointsByDate(data, "average", "createdAt");
    return {
      datasets: [
        {
          borderColor: "#efefef",
          label: CHART_TITLE,
          data: averageData,
          fill: false,
          pointBackgroundColor: "#fff",
          trendlineLinear: {
            style: "#fff",
            lineStyle: "dotted",
            width: 1
          }
        }
      ]
    };
  };

  let datasets;
  let chartReference;
  let isError = false;
  const ERROR_MESSAGE = "There was an error generating the " + CHART_TITLE + " chart.";

  try {
    datasets = getDatasets($averageOutputs);
  } catch (e) {
    isError = true;
    console.error(ERROR_MESSAGE, e);
  }

  averageOutputs.subscribe((value) => {
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


<!-- Defensive: Only show chart if data is a non-empty array with output -->
  {#if Array.isArray($averageOutputs) && $averageOutputs.length > 0}
    <section>
      <div class="section-wrapper">
        {#if isError}
          <p>{ERROR_MESSAGE}</p>
        {:else}
          <h2>{CHART_TITLE}</h2>
          <LineChart title="CHART_TITLE" {datasets} isDarkMode="true" bind:chartReference />
        {/if}
      </div>
    </section>
  {/if}

<style>
  section {
    background: #1a5b92;
    color: #fff;
  }
</style>
