<script>
  import {onMount} from "svelte";
  import Chart from "chart.js/auto";
  import "chartjs-adapter-moment";
  import chartTrendline from "chartjs-plugin-trendline";

  /** @type {{title: any, datasets: any, isDarkMode?: boolean, chartReference?: string}} */
  let {
    title,
    datasets = $bindable(),
    isDarkMode = false
  } = $props();
  let canvas;
  const ERROR_MESSAGE = "An error occurred creating the line chart";
  let screenWidth = $state(0);
  const gridColor = isDarkMode ? "rgba(239,239,239,.1)" : "#e5e5e5";
  const tickColor = isDarkMode ? "#efefef" : "#444";
  const config = {
    type: "line",
    options: {
      scales: {
        x: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: tickColor
          },
          type: "time",
          time: {
            tooltipFormat: "MMM DD, YYYY"
          }
        },
        y: {
          grid: {
            color: gridColor
          },
          ticks: {
            color: tickColor
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const rideTitle = context.dataset.data[context.dataIndex].title;
              let label = rideTitle || "";

              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y;
              }
              return label;
            }
          }
        }
      },
      maintainAspectRatio: false
    }
  };
  let chart;

  try {
    config.data = datasets;
  } catch (e) {
    // isError = true;
    console.error(ERROR_MESSAGE, e);
  }

  
  onMount(async () => {
    try {
      Chart.register({
        chartTrendline
      });
      const ctx = canvas.getContext('2d');
      if (screenWidth < 768) {
        Chart.defaults.elements.point.radius = 0;
        Chart.defaults.elements.line.borderWidth = 2;
      }

      chart = new Chart(ctx, config);
    } catch (e) {
      // isError = true;
      console.error(ERROR_MESSAGE, e);
    }
    $effect(() => {
      config.data = datasets;
      if (chart) {
        chart.update();
      }
    });
  });
</script>

<svelte:window bind:innerWidth={screenWidth} />
<!-- {#if isError}
  <p>{ERROR_MESSAGE}</p>
{:else} -->
  <div class="chart-wrapper"><canvas bind:this={canvas}></canvas></div>
<!-- {/if} -->
