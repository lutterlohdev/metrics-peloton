<script>
  import ProgressBar from "../baseTypes/ProgressBar.svelte";
  import {trimTitle} from "$lib/utils/stringUtils";
  /** @type {{rides: any, color: any}} */
  let { rides, color } = $props();
</script>

{#each rides as ride}
  <ProgressBar
    barLabel={ride.output}
    leftLabel={trimTitle(ride.title)}
    rightLabel={ride.instructor}
    fillColor={color}
    percentage={(ride.output / rides[0].output) * 100}
  />
{/each}
