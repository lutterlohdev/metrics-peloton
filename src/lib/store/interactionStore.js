import {writable} from "svelte/store";

// For variables controlling the user interaction
export const isOptionsSidebarOpen = writable(false);
export const isMenuSidebarOpen = writable(false);
