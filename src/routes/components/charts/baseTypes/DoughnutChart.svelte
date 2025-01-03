<script>
  import {onMount} from "svelte";
  import Chart from "chart.js/auto";
  import {convertStringToID} from "$lib/utils/stringUtils";

  /** @type {{title: any, datasets: any, chartReference?: string}} */
  let { title, datasets, chartReference = $bindable() } = $props();

  const ERROR_MESSAGE = "An error occurred creating the Output Chart";
  const chartID = "chart-" + convertStringToID(title);
  let isError = $state(false);
  let screenWidth = $state(1200);

  const config = {
    type: "doughnut",
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  };

  try {
    config.data = datasets;
  } catch (e) {
    isError = true;
    console.error(ERROR_MESSAGE, e);
  }

  onMount(async () => {
    try {
      const ctx = document.getElementById(chartID);
      chartReference = new Chart(ctx, config);
    } catch (e) {
      isError = true;
      console.error(ERROR_MESSAGE, e);
    }
  });
</script>

<svelte:window bind:innerWidth={screenWidth} />

{#if isError}
  <p>{ERROR_MESSAGE}</p>
{:else}
  <div class="chart-wrapper"><canvas id={chartID}></canvas></div>
{/if}

<style>
  div {
    position: relative;
    min-height: 50vh;
  }
</style>
