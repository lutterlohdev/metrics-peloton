<script>
  import {onMount} from "svelte";
  import {organizedWorkoutsSortedByOutput} from "$lib/store/workoutStore";
  import TopFiveRides from "./TopFiveRides.svelte";
  import {getColorBasedOnArrayLengthAndIndex} from "$lib/utils/colorUtils";
  import { activeData, activeWorkoutType } from "$lib/store/store";

  let durations = Object.keys($organizedWorkoutsSortedByOutput).reverse();

  onMount(async () => {
    organizedWorkoutsSortedByOutput.subscribe((value) => {
      durations = Object.keys(value).reverse();
    });
  });
</script>


<!-- Defensive: Only show for active data with outputs and valid durations -->
{#if Array.isArray($activeData) && $activeData.length > 0 && $activeData.some(workout => workout.output)}
  {#if Array.isArray(durations) && durations.length > 0}
    <section class="top-five-container">
      {#each durations as duration, i}
        {#if Array.isArray($organizedWorkoutsSortedByOutput[duration]) && $organizedWorkoutsSortedByOutput[duration].filter(ride => ride.output != null).length > 0}
          <div class="top-five-card">
            <div class="section-wrapper">
              <h2 style="color:{getColorBasedOnArrayLengthAndIndex(durations.length, i)}">
                Top
                {duration}
                Min Workouts
              </h2>
              <div>
                <TopFiveRides
                  rides={$organizedWorkoutsSortedByOutput[duration].filter(ride => ride.output != null).slice(0, 5)}
                  color={getColorBasedOnArrayLengthAndIndex(durations.length, i)}
                />
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </section>
  {/if}
{:else}
  <section class="top-five-container">
    <div class="section-wrapper">
      <p>No data available for Top 5 Workouts.</p>
    </div>
  </section>
{/if}

<style>
  h2 {
    margin-bottom: 20px;
  }
  .top-five-container {
    margin: 30px 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
  }
  .section-wrapper {
    padding: 0 10px;
  }
  .top-five-card {
    flex: 1 1 300px;
    margin: 30px;
    max-width: 600px;
  }
  @media only screen and (max-width: 768px) {
    .top-five-card {
      margin: 20px;
    }
  }
</style>
