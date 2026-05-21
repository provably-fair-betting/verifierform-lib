<script lang="ts">
  import type { GameEntry } from './types';

  let {
    games,
    selectedGame,
    onselect,
  }: {
    games: Record<string, GameEntry>;
    selectedGame: string;
    onselect: (gameId: string) => void;
  } = $props();

  let open = $state(false);
  let search = $state('');
  let containerEl: HTMLElement | null = $state(null);
  let searchEl: HTMLInputElement | null = $state(null);

  const selected = $derived(games[selectedGame]);

  const filtered = $derived(
    Object.entries(games).filter(([, entry]) =>
      entry.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  function pick(gameId: string) {
    onselect(gameId);
    open = false;
    search = '';
  }

  function toggle() {
    open = !open;
    if (open) {
      search = '';
      // Focus search on next tick
      setTimeout(() => searchEl?.focus(), 0);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      open = false;
      search = '';
    }
  }

  $effect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerEl && !containerEl.contains(e.target as Node)) {
        open = false;
        search = '';
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative" bind:this={containerEl}>
  <!-- Trigger -->
  <button
    type="button"
    onclick={toggle}
    aria-haspopup="dialog"
    aria-expanded={open}
    aria-label="Select game: {selected?.name ?? 'no game selected'}"
    class="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-left hover:bg-gray-300 focus:border-purple-400 focus:ring-0 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
  >
    {#if selected?.image}
      <img
        src={selected.image}
        alt={selected.name}
        class="h-8 w-8 flex-shrink-0 rounded object-cover"
      />
    {/if}
    <span class="flex-1 text-sm font-medium text-gray-900 dark:text-white">
      {selected?.name ?? 'Select a game'}
    </span>
    <svg
      class={['h-4 w-4 flex-shrink-0 text-gray-400 transition-transform', open ? 'rotate-180' : '']}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clip-rule="evenodd"
      />
    </svg>
  </button>

  <!-- Popover -->
  {#if open}
    <div
      class="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border border-gray-400 bg-gray-100 p-3 shadow-2xl dark:border-gray-600 dark:bg-gray-900"
      role="group"
      aria-label="Game selection"
    >
      <!-- Search -->
      <div class="relative mb-3">
        <svg
          class="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          bind:this={searchEl}
          type="search"
          bind:value={search}
          placeholder="Search games…"
          aria-label="Search games"
          class="block w-full rounded border border-gray-200 bg-gray-50 py-1.5 pr-2 pl-8 text-xs text-gray-900 placeholder-gray-400 focus:border-purple-400 focus:ring-0 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
      </div>

      <!-- Grid -->
      {#if filtered.length === 0}
        <p class="py-4 text-center text-xs text-gray-400 dark:text-gray-500">No games found.</p>
      {:else}
        <div class="game-scroll max-h-64 overflow-y-auto pr-4">
          <div class="grid grid-cols-4 gap-1.5 sm:grid-cols-5">
            {#each filtered as [gameId, entry] (gameId)}
              {@const isSelected = gameId === selectedGame}
              <button
                type="button"
                aria-label={entry.name}
                aria-pressed={isSelected}
                onclick={() => pick(gameId)}
                class={[
                  'group flex flex-col items-center overflow-hidden rounded-md border-2 transition-all focus:ring-2 focus:ring-purple-400 focus:outline-none',
                  isSelected ? 'border-purple-500 dark:border-purple-400' : 'border-transparent',
                ]}
              >
                {#if entry.image}
                  <img
                    src={entry.image}
                    alt={entry.name}
                    class="aspect-[3/4] w-full object-cover"
                    loading="lazy"
                  />
                {:else}
                  <div
                    class="flex aspect-[3/4] w-full items-center justify-center bg-gray-100 text-lg font-bold text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                  >
                    {entry.name[0].toUpperCase()}
                  </div>
                {/if}
                <span
                  class={[
                    'w-full truncate px-0.5 py-0.5 text-center text-[10px] leading-tight font-medium',
                    isSelected
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700 group-hover:bg-purple-200 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-purple-900',
                  ]}
                >
                  {entry.name}
                </span>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* Always-visible scrollbar with consistent styling across light/dark */
  .game-scroll {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
  }

  .game-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .game-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .game-scroll::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  @media (prefers-color-scheme: dark) {
    .game-scroll {
      scrollbar-color: #4b5563 transparent;
    }

    .game-scroll::-webkit-scrollbar-thumb {
      background: #4b5563;
    }
  }
</style>
