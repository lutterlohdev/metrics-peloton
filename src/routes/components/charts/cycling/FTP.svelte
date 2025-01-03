<script>
  import LineChart from "../baseTypes/LineChart.svelte";
  import {ftpAverageOutputs} from "$lib/store/cyclingStore";
  import {getReadableDate} from "$lib/utils/dateUtils";
  import {createPlotPoint, calculateFTP} from "$lib/utils/chartUtils";

  const getPlotPoints = (data) => {
    return data.map((ride) => {
      const ftpValue = calculateFTP(ride.average);
      const date = getReadableDate(ride.createdAt);
      const title = ride.title;
      return createPlotPoint(date, ftpValue, title);
    });
  };

  const getDatasets = (data) => {
    return {
      datasets: [
        {
          borderColor: "#fff",
          label: "FTP Tests",
          data: getPlotPoints(data),
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

  let datasets = $state();
  let chartReference = $state();
  let isError = $state(false);
  const ERROR_MESSAGE = "There was an error generating the Average Output chart.";

  try {
    datasets = getDatasets($ftpAverageOutputs);
  } catch (e) {
    isError = true;
    console.error(ERROR_MESSAGE, e);
  }

  ftpAverageOutputs.subscribe((value) => {
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

<!-- Need more than one for this to show up properly -->
{#if $ftpAverageOutputs.length > 1}
  <section>
    <div class="section-wrapper">
      {#if isError}
        <p>{ERROR_MESSAGE}</p>
      {:else}
        <h2>Function Threshold Power (FTP) Over Time</h2>
        <LineChart
          title="Function Threshold Power (FTP) Over Time"
          {datasets}
          isDarkMode="true"
          bind:chartReference
        />
      {/if}
    </div>
  </section>
{/if}

<style>
  section {
    background: #04a6c2ff;
    color: #fff;
  }
</style>
