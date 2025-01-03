<script>
  /** @type {{children?: import('svelte').Snippet}} */
  let { children } = $props();
</script>

<p>
  {@render children?.()}
</p>

<style>
  p {
    background-color: #00b2ca;
    color: #fff;
    font-size: 16px;
    padding: 20px;
    margin: 0 0 10px 0;
    text-align: center;
  }
</style>
