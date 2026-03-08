<script>
  import {filteredData, activeWorkoutType} from "$lib/store/store.js";
  import {isMenuSidebarOpen} from "$lib/store/interactionStore.js";
  import Sidebar from "../components/navigation/Sidebar.svelte";
  import {getColorBasedOnArrayLengthAndIndex} from "$lib/utils/colorUtils.js";

  const handleActiveWorkoutTypeChange = (type) => {
    activeWorkoutType.set(type);
    isMenuSidebarOpen.set(false);
  };
</script>

<!-- TODO: Figure out accessibility here - setting focus properly-->
<Sidebar side="left" bind:isOpen={$isMenuSidebarOpen}>
  <h2>Workout Type</h2>
  <nav>
    <!-- TODO Figure out proper semantic here -->
    {#each Object.keys($filteredData) as workoutType, i}
      <!-- Only show if workouts exist after filters-->
      {#if $filteredData[workoutType].length > 0}
        <button
          type="button"
          on:click={() => handleActiveWorkoutTypeChange(workoutType)}
          style={"background:" +
            getColorBasedOnArrayLengthAndIndex(Object.keys($filteredData).length, i)}
        >
          {workoutType}
        </button>
      {/if}
    {/each}
  </nav>
</Sidebar>

<style>
  h2 {
    text-align: left;
  }
  button {
    display: block;
    width: 100%;
    color: #fff;
    padding: 1em;
    font-weight: bold;
    text-align: left;
    border: 0;
    text-transform: capitalize;
    font-size: 14px;
    margin-bottom: 11px;
    cursor: pointer;
    transition: 0.5s background;
  }
  button:hover,
  button:focus {
    background: #000 !important;
  }
</style>
