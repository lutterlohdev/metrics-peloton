<script>
  import {activeWorkoutType, csvData} from "$lib/store/store.js";
  import {isOptionsSidebarOpen} from "$lib/store/interactionStore.js";

  const clearData = () => {
    localStorage.clear();
    csvData.set();
    isOptionsSidebarOpen.set(false);
    activeWorkoutType.set("Cycling");
  };
</script>

<h3>Manage Data</h3>
<button class="normal-button" type="button" on:click={clearData}>Clear My Data</button>
