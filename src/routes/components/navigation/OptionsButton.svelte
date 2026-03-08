<script>
  import {isOptionsSidebarOpen as isOpen} from "$lib/store/interactionStore.js";
</script>

<button type="button" on:click={() => isOpen.set(($isOpen = !$isOpen))} class:$isOpen
  ><span class="sr-only">Options</span></button
>

<style>
  button {
    background-image: url(/images/settings-icon.svg);
    background-repeat: no-repeat;
    background-size: 24px;
    height: 30px;
    width: 30px;
    background-position: center center;
    border: 0;
    background-color: transparent;
    transition: 0.5s all;
    border-radius: 100%;
    cursor: pointer;
    margin: 10px;
  }
  button:hover,
  button:focus {
    transform: rotate(30deg);
  }
  button.isOpen {
    transform: rotate(-90deg);
  }
</style>
