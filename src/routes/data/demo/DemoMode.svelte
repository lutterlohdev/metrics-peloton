<script>
  import {csvData} from "$lib/store/store.js";
  import demoData from "./demoData.json";

  let y = 0;

  const updateData = (json) => {
    try {
      csvData.set(json);
      y = 0;
      localStorage.setItem("savedData", JSON.stringify(json));
    } catch (error) {
      console.error(error);
    }
  };

  const loadDemoMode = () => {
    updateData(demoData);
  };
</script>

<svelte:window bind:scrollY={y} />
{#if !$csvData}
  <button class="footer-button" on:click={() => loadDemoMode()}
    ><span class="sr-only">Activate </span>Demo Mode</button
  >
{/if}
