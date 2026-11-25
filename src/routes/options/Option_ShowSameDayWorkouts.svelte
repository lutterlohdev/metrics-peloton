<script>
  import {showSameDayWorkouts} from "#lib/store/store.js";
</script>

<div>
  <h3>Exclude Same Day Rides</h3>
  <p>
    This is useful to filter out pre/post rides (such as cooldown rides, etc). By default, only the
    highest output ride for a day will be shown.
  </p>
  <p>Note: Changing this will wipe out your existing date filter.</p>
  <label class="option-label">
    <input type="checkbox" bind:checked={$showSameDayWorkouts} class="option-field" />
    Show Same Day Rides
  </label>
</div>

<style>
  .option-label {
    margin-bottom: 10px;
  }
</style>
