<script>
  import {isMenuSidebarOpen} from "$lib/store/interactionStore.js";
</script>

<div
  class="button {$isMenuSidebarOpen ? "isOpen" : ""}"
  role="button"
  type="button"
  onclick={() => (isMenuSidebarOpen.set($isMenuSidebarOpen = !$isMenuSidebarOpen))}
  tabindex="0"
  onkeypress={() => (isMenuSidebarOpen.set($isMenuSidebarOpen = !$isMenuSidebarOpen))}
>
  <div class="line"></div>
  <div class="line"></div>
  <div class="line"></div>
</div>

<style>
  .button {
    z-index: 3;
    right: 35px;
    top: 35px;
    cursor: pointer;
    transition: all 0.5s ease-out;
    margin: 15px;
  }
  .button.isOpen {
    transform: rotate(180deg);
  }

  .line {
    width: 28px;
    height: 3px;
    margin: 0 0 5px 0;
    background: #fff;
    transition: all 0.5s ease-out;
  }
  .button.isOpen .line:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .button.isOpen .line:nth-child(2) {
    opacity: 0;
  }

  .button.isOpen .line:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
</style>
