<script>
  import {slide} from "svelte/transition";
  /** @type {{children?: import('svelte').Snippet}} */
  let { children } = $props();
</script>

<p transition:slide>
  {@render children?.()}
</p>

<style>
  p {
    background-color: #d1495b;
    color: #fff;
    font-size: 16px;
    padding: 20px;
    margin: 0;
    text-align: center;
  }
</style>
