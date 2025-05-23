<script>
  import CSVUpload from "../data/CSVUpload.svelte";
  import OutputOverTime from "./charts/cycling/OutputOverTime.svelte";
  // import FTP from "./charts/cycling/FTP.svelte"; // Cycling-specific, consider generic version or remove
  import AverageOutput from "./charts/cycling/AverageOutput.svelte";
  // import AverageCadenceVsResistance from "./charts/cycling/AverageCadenceVsResistance.svelte"; // Cycling-specific, consider generic version or remove
  // import AverageOutputByInstructor from "../charts/charts/AverageOutputByInstructor.svelte";
  import ClassesTakenByInstructor from "./charts/general/ClassesTakenByInstructor.svelte";
  import ErrorMessage from "./messaging/ErrorMessage.svelte";
  import {isError, csvData} from "$lib/store/store.js";
  import TopFiveSection from "./charts/cycling/TopFiveSection.svelte";
  import TotalsSection from "./charts/totals/TotalsSection.svelte";
  import InfoMessage from "./messaging/InfoMessage.svelte";
  import AverageOutputByRideType from "./charts/cycling/AverageOutputByRideType.svelte";
  import AverageTotalOutputByInstructor from "./charts/cycling/AverageTotalOutputByInstructor.svelte";
  import ClassesTakenByType from "./charts/general/ClassesTakenByType.svelte";
</script>

<main>
  {#if $isError}
    <ErrorMessage>
      Sorry, an error occurred while processing the file. Please try again.
    </ErrorMessage>
  {/if}
  {#if $csvData && $csvData.length > 0}
    <TotalsSection />
    <ClassesTakenByType />
    <OutputOverTime />
    <AverageOutput />
    <!-- <FTP /> -->
    <ClassesTakenByInstructor />
    <!-- <AverageOutputByInstructor /> Hiding this for now-->
    <AverageTotalOutputByInstructor />
    <!-- <AverageCadenceVsResistance /> -->
    <AverageOutputByRideType />
    <TopFiveSection />
  {:else}
    <InfoMessage
      >Upload your Peloton rides to see your output over time, averages, top rides, and more!</InfoMessage
    >
    <CSVUpload />
  {/if}
</main>

<style>
  main {
    margin: 0 auto;
    padding-top: 50px;
  }
</style>
