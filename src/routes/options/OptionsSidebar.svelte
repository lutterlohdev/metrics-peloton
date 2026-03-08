<script>
  import Sidebar from "../components/navigation/Sidebar.svelte";
  import ExcludeRideTypes from "./Option_ExcludeRideTypes.svelte";
  import ShowSameDayWorkouts from "./Option_ShowSameDayWorkouts.svelte";
  import OptionDates from "./Option_Dates.svelte";
  import ClearData from "../data/ClearData.svelte";
  import {isOptionsSidebarOpen} from "$lib/store/interactionStore";
</script>

<Sidebar bind:isOpen={$isOptionsSidebarOpen} side="right">
  <h2>Options</h2>
  <OptionDates />
  <form>
    <ExcludeRideTypes />
    <ShowSameDayWorkouts />
  </form>
  <ClearData />
</Sidebar>

<style>
  h2 {
    text-align: left;
  }
</style>
