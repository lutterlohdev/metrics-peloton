<script>
  import {averageOutputByType} from "$lib/store/workoutStore";
  import { activeData, activeWorkoutType } from "$lib/store/store";
</script>


<!-- Defensive: Only show chart if data is a non-empty array with output -->
{#if Array.isArray($activeData) && $activeData.length > 0 && $activeData.some(workout => workout.output)}
  <section>
    <div class="section-wrapper">
      <h2>Average Outputs By Workout Type</h2>
      {#if Object.keys($averageOutputByType).length > 0}
        <ul class="list-wrapper">
          {#each Object.entries($averageOutputByType).slice(0, 8) as [type, avg]}
            <li class="chart-value">
              {type}
              <span>{avg}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </section>
{/if}

<style>
  section {
    background: #048ba8ff;
    color: #fff;
  }
  .list-wrapper {
    padding: 0;
    margin: 0 40px;
  }
  .chart-value {
    background: #fff;
    color: #048ba8ff;
    font-size: 16px;
    padding: 1em 1.4em;
    line-height: 24px;
    margin-bottom: 10px;
  }
  span {
    font-weight: 100;
    font-size: 24px;
    float: right;
  }
  @media only screen and (min-width: 768px) {
    .list-wrapper {
      column-count: 2;
      column-gap: 20px;
    }
  }
</style>
