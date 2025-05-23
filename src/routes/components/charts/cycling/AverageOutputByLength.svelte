<script>
  import {averageOutputsByDuration} from "$lib/store/workoutStore";
  import {activeData, activeWorkoutType} from "$lib/store/store.js";
</script>


<!-- Defensive: Only show chart if data is a non-empty array with output -->
{#if Array.isArray($activeData) && $activeData.length > 0 && $activeData.some(workout => workout.output)}
  {#if Array.isArray($averageOutputsByDuration) && $averageOutputsByDuration.length > 0}
    <div>
      <h2>Average Outputs By Workout Length</h2>
      <ul>
        {#each $averageOutputsByDuration as average}
          <li style="background-color:{average.color}">
            <span>{average.duration} Min</span><span class="sr-only">:</span>
            {average.value}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
{/if}

<style>
  div {
    margin-top: 30px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  li {
    flex: 1 1 auto;
    font-size: 1.6em;
    color: #fff;
    font-weight: bold;
    padding: 10px;
    text-align: center;
    flex-direction: column;
    align-items: center;
    margin: 3px;
    border-radius: 8px;
  }
  span {
    display: block;
    text-align: center;
    font-weight: lighter;
    font-size: 0.8em;
  }
</style>
