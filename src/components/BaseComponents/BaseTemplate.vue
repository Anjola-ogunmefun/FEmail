<template>
  <main>
    <unread-template
      :from="from"
      :subject="subject"
      :body="body"
      v-if="!isRead"
    ></unread-template>
    <div
      class="border-t border-b mb-6 container shadow-l border-gray-300 bg-white p-4 flex flex-col justify-between leading-normal"
      v-else
    >
      <span class="flex items-center"
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
        <h1 class="text-xl font-bold px-4 truncate">{{ from }}</h1>
      </span>
      <div class="mb-4 ml-16">
        <div class="text-black font-medium text-lg px-2 -mt-3 mb-2 truncate">
          {{ subject }}
        </div>
        <p class="text-gray-600 text-base px-2 truncate max-w-full">
          {{ body }}
        </p>
      </div>
    </div>
  </main>
</template>

<script>
import UnreadTemplate from "./UnreadTemplate.vue";
export default {
  props: ["from", "subject", "body", "read", "userData"],
  components: {
    UnreadTemplate,
  },
  data() {
    return {
      isRead: false,
    };
  },
  mounted() {
    // const inbox = this.$store.getters["mail/getInbox"];

    this.read.forEach((recepient) => {
      for (const key in recepient) {
        if (this.userData === key && recepient[key] === true) {
          this.isRead = true;
          console.log('base', recepient[key])
          return
        }
      }
      console.log("is read", this.isRead);
    });
  },
};
</script>
