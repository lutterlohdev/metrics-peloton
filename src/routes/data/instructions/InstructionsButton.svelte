<script>
  import {getContext} from "svelte";
  import InstructionsContent from "./InstructionsContent.svelte";

  const {open} = getContext("simple-modal");
  const showModal = () => {
    open(InstructionsContent);
  };
</script>

<div>
  <button class="link-button" type="button" onclick={showModal}>Instructions</button>
</div>

<style>
  div {
    top: 10px;
    right: 10px;
    position: absolute;
  }
</style>
