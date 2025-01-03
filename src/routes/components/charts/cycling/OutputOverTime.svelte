<script>
  import {organizedEffortsByDuration} from "$lib/store/outputStore"; 
  import {getPlotPointsByDate} from "$lib/utils/chartUtils";
  import AverageOutputsByLength from "./AverageOutputByLength.svelte";
  import {getColorBasedOnArrayLengthAndIndex} from "$lib/utils/colorUtils";
  import {activeData} from "$lib/store/store.js";
  import {onMount} from "svelte";
  import Chart from "chart.js/auto";
  import "chartjs-adapter-moment";
  import chartTrendline from "chartjs-plugin-trendline";

  let canvas = $state();
  let chart;
  let screenWidth = $state(0);
  let shouldDisplay = $state(true);
  const gridColor =  "#e5e5e5" ;
  const tickColor = "#444" ;
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

  const getDatasets = (effortsByDuration) => {
    const datasets = [];
    const durations = Object.keys(effortsByDuration);

    // check if each duration has at least one workout
    if (durations.some(duration => effortsByDuration[duration].length > 0)) {
      shouldDisplay = true;

      for (const [i, duration] of durations.entries()) {
        const efforts = effortsByDuration[duration];
        const workouts = getPlotPointsByDate(efforts, "output", "date");
        const color = getColorBasedOnArrayLengthAndIndex(durations.length, i);
        const label = duration + " Minute Workouts";

        const dataset = {
          borderColor: color,
          label: label,
          data: workouts,
          fill: false,
          pointBackgroundColor: color,
          trendlineLinear: {
            style: color,
            lineStyle: "dotted",
            width: 1
          }
        };

        datasets.push(dataset);
      }
    } else {
      shouldDisplay = false;
    }
    
    return {
      datasets: datasets
    };
  };

  let isError = $state(false);
  const ERROR_MESSAGE = "There was an error generating the output over time chart.";

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
      config.data = getDatasets($organizedEffortsByDuration);
      chart = new Chart(ctx, config);
    } catch (e) {
      isError = true;
      console.error(ERROR_MESSAGE, e);
    }
  });

  $effect(() => {
    config.data = getDatasets($organizedEffortsByDuration);
    console.log(config)
    if (chart) {
      chart.update();
    }
  });
</script>

<svelte:window bind:innerWidth={screenWidth} />
{#if shouldDisplay}
<section>
  <div class="section-wrapper">
    {#if isError}
      <p>{ERROR_MESSAGE}</p>
    {:else}
      <h2>Output Over Time</h2>
      <div class="chart-wrapper"><canvas bind:this={canvas}></canvas></div>
      <AverageOutputsByLength />
    {/if}
  </div>
</section>
{/if}

<style>
  .section-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 10px 60px;
  }
</style>
