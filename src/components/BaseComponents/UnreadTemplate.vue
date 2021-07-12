<template>
  <div
    class="border-t border-b mb-2 container shadow-l border-gray-300 bg-gray-200 p-4 flex flex-col justify-between leading-normal"
  >
    <span class="flex items-center text-black "
      ><span>
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          class="w-14 h-14"
        >
          <path
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </span>
      <h1 class="text-red text-xl font-bold px-4">{{ from }}</h1>
    </span>
    <div class="mb-4 ml-16">
      <div class="text-black font-medium text-lg px-2 -mt-3 mb-2">
        {{ subject }}
      </div>
      <p class="text-black text-base px-2 truncate max-w-full">
        {{ body }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["from", "subject", "body"],
};
</script>
