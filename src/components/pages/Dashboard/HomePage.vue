<template>
  <main>
    <nav
      class="flex static w-full items-center justify-between px-6 h-16 bg-white text-gray-700 border-b border-gray-200 z-10"
    >
      <div class="flex items-center">
        <button class="mr-2" aria-label="Open Menu" @click="drawer">
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            class="w-8 h-8"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      <h1 class="flex text-lg font-semibold md:text-2xl md:ml-12">
        {{ userName }}
      </h1>

      <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        class="w-10 h-8 flex ml-80 md:ml-auto"
      >
        <path
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        ></path>
      </svg>

      <span
        class="bg-black text-white text-xs py-1 font-bold px-2 -ml-6 mb-5 rounded-full"
        v-if="unreadMail.length > 0"
      >
        {{ unreadMail.length }}
      </span>

      <transition
        enter-class="opacity-0"
        enter-active-class="ease-out transition-medium"
        enter-to-class="opacity-100"
        leave-class="opacity-100"
        leave-active-class="ease-out transition-medium"
        leave-to-class="opacity-0"
      >
        <div
          @keydown.esc="isOpen = false"
          v-show="isOpen"
          class="z-10 fixed inset-0 transition-opacity"
        >
          <div
            @click="isOpen = false"
            class="absolute inset-0 bg-black opacity-5"
            tabindex="0"
          ></div>
        </div>
      </transition>
      <aside
        class="transform top-0 left-0 w-64 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 :md:{isOpen = true}"
        :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <span
          @click="isOpen = false"
          class="flex w-full items-center p-4 border-b"
        >
          <img
            src="../../../utils/logo2.png"
            alt="Logo"
            class="h-14 w-22 mx-auto"
          />
        </span>

        <span
          @click="isOpen = false"
          class="flex items-center p-4 hover:bg-gray-800 hover:text-white hover:img-white "
          ><span class="mr-2">
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              class="w-6 h-6"
            >
              <path
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          </span>
          <router-link to="/compose" class="md:text-xl">Compose</router-link>
        </span>

        <span
          @click="isOpen = false"
          class="flex items-center p-4 hover:bg-gray-800 hover:text-white "
          ><span class="mr-2">
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              class="w-6 h-6"
            >
              <path
                d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"
              ></path>
            </svg>
          </span>

          <router-link to="/inbox" class="md:text-xl ">Inbox</router-link>

          <span
            class="bg-gray-800 hover:bg-white hover:text-black text-white font-bold px-2 ml-2 rounded-full"
            v-if="unreadMail.length > 0"
          >
            {{ unreadMail.length }}
          </span>
        </span>

        <span
          @click="isOpen = false"
          class="flex items-center p-4 hover:bg-gray-800 hover:text-white "
          ><span class="mr-2">
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              class="w-6 h-6"
            >
              <path
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              ></path>
            </svg>
          </span>
          <router-link to="/sent" class="md:text-xl">Sent</router-link>
        </span>
        <span
          @click="isOpen = false"
          class="flex items-center p-4 hover:bg-gray-800 hover:text-white "
          ><span class="mr-2">
            <svg
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
              class="w-6 h-6"
            >
              <path
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </span>
          <router-link to="/draft" class="md:text-xl">Draft</router-link>
        </span>
        <span
          @click="isOpen = false"
          class="flex items-center p-4 hover:bg-gray-800 hover:text-white "
          ><span class="mr-2">
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              class="w-6 h-6"
            >
              <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </span>
          <router-link to="/bin" class="md:text-xl">Bin</router-link>
        </span>
      </aside>
    </nav>

    <section>
      <h1
        class="text-black font-semibold  text-xl md:text-3xl ml-3 px-4 mt-4 mb-3"
      >
        Inbox
      </h1>

      <div v-if="myMail.length === 0 && !isLoading">
        <p
          class="text-black font-medium text-lg md:text-2xl px-4 mb-2 mt-24 text-center"
        >
          No mail for you yet!
        </p>
      </div>

      <transition v-else-if="showContent">
        <mail-content :mail="selectedMail" @delete-mail="bin"></mail-content>
      </transition>

      <div v-else>
        <base-template
          v-for="mail in myMail"
          :key="mail.id"
          :id="mail.id"
          :from="mail.from"
          :subject="mail.subject"
          :body="mail.body"
          :read="mail.read"
          :userData="userData"
          @click="loadContent(mail)"
        ></base-template>
      </div>

      <base-spinner v-if="isLoading && !error"></base-spinner>
    </section>
  </main>
</template>

<script>
import MailContent from "./MailContent.vue";
import BaseSpinner from "../../BaseComponents/BaseSpinner.vue";
import BaseTemplate from "../../BaseComponents/BaseTemplate.vue";

export default {
  props: ["from", "subject", "body", "read"],

  components: { BaseSpinner, MailContent, BaseTemplate },

  data() {
    return {
      isLoading: false,
      error: null,
      isOpen: false,
      loggedInUser: "",
      myMail: [],
      showContent: false,
      selectedMail: {},
      unreadMail: [],
      userName: "",
    };
  },

  methods: {
    drawer() {
      this.isOpen = !this.isOpen;
    },
    async loadContent(mail) {
      this.selectedMail = mail;
      this.showContent = true;
      await this.$store.dispatch("mail/removeUnread", mail);
      mail.read.forEach((recepient) => {
        for (const key in recepient) {
          if (this.userData === key) {
            recepient[key] = true;
          }
        }
      });
    },
    async bin(mail) {
      await this.$store.dispatch("mail/firstDelete", mail);
      mail.subDelete.forEach((recepient) => {
        for (const key in recepient) {
          if (this.userData === key) {
            recepient[key] = true;
          }
        }
      });
      window.location.reload();
    },
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(isOpen) {
        if (process.client) {
          if (isOpen) document.body.style.setProperty("overflow", "hidden");
          else document.body.style.removeProperty("overflow");
        }
      },
    },
  },
  async mounted() {
    document.addEventListener("keydown", (e) => {
      if (e.keyCode == 27 && this.isOpen) this.isOpen = false;
    });

    this.isLoading = true;
    try {
      await this.$store.dispatch("mail/loadMail");
      await this.$store.dispatch("user/findUser");
      await this.$store.dispatch("user/loadUsers");
      const allUsers = this.$store.getters["user/allUsers"];
      const inbox = this.$store.getters["mail/getInbox"];
      this.loggedInUser = this.$store.getters["user/loggedInUser"];

      for (const key in allUsers) {
        if (this.loggedInUser === allUsers[key].email)
          this.userData = allUsers[key].id;
        if (allUsers[key].email === this.loggedInUser) {
          this.userName = allUsers[key].firstName;
        }
      }

      for (let i = 0; i < inbox.length; i++) {
        inbox[i].to.forEach((person) => {
          if (person === this.loggedInUser) {
            this.myMail.push(inbox[i]);
          }
        });
      }
      for (let i = 0; i < this.myMail.length; i++) {
        this.myMail[i].read.forEach((recepient) => {
          for (const key in recepient) {
            if (this.userData === key && recepient[key] === false) {
              this.unreadMail.push(this.myMail[i]);
            }
          }
        });
      }

      for (const key in allUsers) {
        if (allUsers[key].email === this.loggedInUser) {
          this.userName = allUsers[key].firstName;
        }
      }
    } catch (err) {
      this.error = err.message;
    }
    this.isLoading = false;
  },
};
</script>
