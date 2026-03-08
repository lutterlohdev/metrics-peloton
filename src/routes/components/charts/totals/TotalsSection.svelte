<script>
  import {
    activeData,
    totalCalories,
    totalMinutes,
    distanceUnit,
    totalDistance
  } from "$lib/store/store";
  import {formatNumberWithCommas} from "$lib/utils/numberUtils";
  import IconStat from "./IconStat.svelte";
</script>

<section>
  <div class="section-wrapper">
    <h2>Totals</h2>

    <div class="wrapper">
      <IconStat
        statTitle="Classes"
        statNumber={formatNumberWithCommas($activeData.length)}
        iconFile="../images/exercise.svg"
      />
      <IconStat
        statTitle="Minutes"
        statNumber={formatNumberWithCommas($totalMinutes)}
        iconFile="../images/stopwatch.svg"
      />
      {#if $totalDistance && $totalDistance > 0}
        <IconStat
          statTitle={distanceUnit == "km" ? "Kilometers" : "Miles"}
          statNumber={formatNumberWithCommas($totalDistance)}
          iconFile="../images/moving.svg"
        />
      {/if}
      {#if $totalCalories && $totalCalories > 0}
        <IconStat
          statTitle="Calories"
          statNumber={formatNumberWithCommas($totalCalories)}
          iconFile="../images/energy.svg"
        />
      {/if}
    </div>
  </div>
</section>

<style>
  h2 {
    margin-bottom: 0;
  }
  section {
    background-color: #1a5b92;
    color: #fff;
    margin: 0;
    position: relative;
    max-width: 100vw;
    padding: 10px;
  }
  .section-wrapper {
    margin: 0 auto;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 20px;
  }
</style>
