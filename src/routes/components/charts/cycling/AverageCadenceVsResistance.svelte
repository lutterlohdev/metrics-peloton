<script>
  import LineChart from "../baseTypes/LineChart.svelte";
  import {averageResistance, averageCadence} from "$lib/store/cyclingStore";
  import { activeData, activeWorkoutType } from "$lib/store/store";
  import {getPlotPointsByDate} from "$lib/utils/chartUtils";

  const getDatasets = (averageCadence, averageResistance) => {
    const cadenceData = getPlotPointsByDate(averageCadence, "average", "createdAt");
    const resistanceData = getPlotPointsByDate(averageResistance, "average", "createdAt");

    return {
      datasets: [
        {
          borderColor: "#A9D6E5",
          label: "Average Cadence",
          data: cadenceData,
          fill: false,
          pointBackgroundColor: "#A9D6E5",
          trendlineLinear: {
            style: "#A9D6E5",
            lineStyle: "dotted",
            width: 1
          }
        },
        {
          borderColor: "#3FC1C0",
          label: "Average Resistance (%)",
          data: resistanceData,
          fill: false,
          pointBackgroundColor: "#3FC1C0",
          trendlineLinear: {
            style: "#3FC1C0",
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
  const ERROR_MESSAGE = "There was an error generating the output over time chart.";

  try {
    datasets = getDatasets($averageCadence, $averageResistance);
  } catch (e) {
    isError = true;
    console.error(ERROR_MESSAGE, e);
  }

  averageCadence.subscribe((value) => {
    try {
      if (chartReference) {
        chartReference.data = getDatasets(value, $averageResistance);
        chartReference.update();
      }
    } catch (e) {
      isError = true;
      console.error(ERROR_MESSAGE, e);
    }
  });

  averageResistance.subscribe((value) => {
    try {
      if (chartReference) {
        chartReference.data = getDatasets($averageCadence, value);
        chartReference.update();
      }
    } catch (e) {
      isError = true;
      console.error(ERROR_MESSAGE, e);
    }
  });
</script>


<!-- Defensive: Only show chart if data is a non-empty array -->
{#if $activeWorkoutType == "Cycling"}
  {#if (Array.isArray($averageCadence) && $averageCadence.length > 0) || (Array.isArray($averageResistance) && $averageResistance.length > 0)}
    <section>
      <div class="section-wrapper">
        {#if isError}
          <p>{ERROR_MESSAGE}</p>
        {:else}
          <h2>Average Cadence vs Resistance</h2>
          <LineChart
            title="Average Cadence vs Resistance"
            {datasets}
            isDarkMode="true"
            bind:chartReference
          />
        {/if}
      </div>
    </section>
  {/if}
{/if}

<style>
  section {
    background: #1a5b92;
    color: #fff;
  }
  .section-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 60px 10px;
  }
</style>
