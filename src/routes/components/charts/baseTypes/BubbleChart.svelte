<script>
  import {onMount} from "svelte";
  import Chart from "chart.js/auto";
  import {convertStringToID} from "$lib/utils/stringUtils";

  /** @type {{title: any, datasets: any, chartReference?: string}} */
  let { title, datasets, chartReference = $bindable() } = $props();

  const ERROR_MESSAGE = "An error occurred creating the chart";
  const chartID = "chart-" + convertStringToID(title);
  let isError = $state(false);
  let screenWidth = $state(1200);

  const config = {
    type: "bubble",
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          // This needs to be updated if another chart wants to use polar area since it's specific to average output by instructor
          // callbacks: {
          //   label: function(context) {
          //     const instructor = context.dataset.metadata[context.dataIndex].instructor;
          //     const count = context.dataset.metadata[context.dataIndex].count;
          //     let label = instructor || "";
          //     if (label) {
          //       label += ": ";
          //     }
          //     if (context.parsed.r !== null) {
          //       label += context.parsed.r;
          //       label += " out of " + count + " ride" + (count > 1 ? "s" : "");
          //     }
          //     return label;
          //   },
          // },
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
