<template>
  <section>
    <span>
      <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        class="w-6 h-6 mt-4 ml-6"
        @click="back"
        v-if="!showContent"
      >
        <path d="M15 19l-7-7 7-7"></path>
      </svg>
    </span>

    <h1 class="text-black font-semibold text-xl md:text-3xl ml-3 px-4 mt-4 mb-3">Sent</h1>

    <div v-if="myMail.length === 0 && !isLoading">
      <p class="text-black font-medium text-lg md:text-2xl px-4 mb-2 mt-24 text-center">
        No mail sent yet!
      </p>
    </div>

    <mail-content
      v-else-if="showContent"
      :mail="selectedMail"
      @delete-mail="bin"
    ></mail-content>

    <div v-else>
      <general-template
        v-for="mail in myMail"
        :key="mail.id"
        :to="mail.to[0]"
        :subject="mail.subject"
        :body="mail.body"
        @click="loadContent(mail)"
      ></general-template>
    </div>
    <base-spinner v-if="isLoading && !error"></base-spinner>
  </section>
</template>

<script>
import BaseSpinner from "../../BaseComponents/BaseSpinner.vue";
import GeneralTemplate from "../../BaseComponents/GeneralTemplate.vue";
import MailContent from "./MailContent.vue";

export default {
  components: { BaseSpinner, GeneralTemplate, MailContent },
  data() {
    return {
      loggedInUser: "",
      myMail: [],
      isLoading: false,
      error: null,
      selectedMail: {},
      showContent: false,
    };
  },
  methods: {
    loadContent(mail) {
      this.selectedMail = mail;
      this.showContent = true;
    },
    async bin(mail) {
      await this.$store.dispatch("mail/firstDelete", mail);
      window.location.reload();
    },
    back() {
      return this.$router.go(-1);
    },
  },

  async mounted() {
    this.isLoading = true;
    try {
      await this.$store.dispatch("mail/loadMail");
      await this.$store.dispatch("user/findUser");
      const sent = this.$store.getters["mail/getInbox"];
      this.loggedInUser = this.$store.getters["user/loggedInUser"];

      for (let i = 0; i < sent.length; i++) {
        if (sent[i].from === this.loggedInUser) {
          this.myMail.push(sent[i]);
        }
      }
    } catch (err) {
      this.error = err.message;
    }
    this.isLoading = false;
  },
};
</script>
