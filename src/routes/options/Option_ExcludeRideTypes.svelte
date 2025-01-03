<script>
  import {workoutTypes, titleFilters} from "$lib/store/store.js";

  const handleChange = (filter, value) => {
    if (value) {
      $titleFilters.push(filter);
    } else {
      const filterToRemove = $titleFilters.indexOf(filter);
      $titleFilters.splice(filterToRemove, 1);
    }

    titleFilters.set($titleFilters);
  };
</script>

<div>
  <h3>Exclude Workout Types</h3>
  <div class="columns">
    {#each $workoutTypes as type}
      <label class="option-label">
        <input
          type="checkbox"
          onchange={(e) => handleChange(type, e.target.checked)}
          checked={$titleFilters.includes(type) ? "checked" : false}
          class="option-field"
        />
        {type}
      </label>
    {/each}
  </div>
</div>

<style>
  .columns {
    column-count: 2;
  }
  .option-label {
    margin-bottom: 10px;
  }
</style>
