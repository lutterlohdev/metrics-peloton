<script>
  import {fly} from "svelte/transition";

  /** @type {{isOpen?: boolean, side?: string, children?: import('svelte').Snippet}} */
  let { isOpen = $bindable(false), side = "right", children } = $props();

  const handleSidebar = () => (isOpen = !isOpen);
</script>

{#if isOpen}
  <aside transition:fly={{x: side == "right" ? 200 : -200, duration: 500}} class:open={isOpen} class:left={side == "left"}>
    <div>
      {@render children?.()}
    </div>
  </aside>
  <div role="none" class="overlay" onclick={handleSidebar} onkeypress={handleSidebar}></div>
{/if}

<style>
  aside {
    top: 0;
    height: 100vh;
    width: 30vw;
    position: fixed;
    background: #efefef;
    z-index: 99998;
    overflow: scroll;
  }
  .open {
    left: 70vw;
    box-shadow: -1px 0 2px #777;
  }
  .open.left{
    left: 0;
  }
  aside > div {
    padding: 20px;
    padding-top: 72px;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9997;
  }
  @media only screen and (max-width: 768px) {
    aside {
      width: 90vw;
    }
    .open {
      left: 10vw;
    }
  }
</style>
