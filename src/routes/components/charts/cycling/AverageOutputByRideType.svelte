<script>
  import {averageOutputByWorkoutType} from "$lib/store/outputStore";
  import { activeData } from "$lib/store/store";
</script>

<!-- Only show for active data with outputs -->
{#if $activeData.some(workout => workout.output)}
<section>
  <div class="section-wrapper">
    <h2>Average Outputs By Ride Type</h2>
    <ul class="list-wrapper">
      {#each $averageOutputByWorkoutType.slice(0, 8) as rideType}
        <li class="chart-value">
          {rideType.type}
          <span>{rideType.averageOutput}</span>
        </li>
      {/each}
    </ul>
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
