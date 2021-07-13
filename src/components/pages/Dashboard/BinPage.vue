<template>
  <section>

    <div class="flex -mb-7">
      <h1 class="text-black font-semibold text-xl ml-3 px-4 mt-4">Bin</h1>
      <span @click="clearBin" class="float-right p-4 has-tooltip ">
        <span class="tooltip rounded shadow-sm p-1  text-black -mt-8"
          >Clear all items in bin</span
        >

        <span class="mr-2">
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            class="w-6 h-6"
            @click="bin"
          >
            <path
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </span>
      </span>
    </div>
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
    <div v-if="myBin.length === 0 && !isLoading">
      <p class="text-black font-medium text-lg px-4 mb-2 mt-24 text-center">
        Bin is empty!
      </p>
    </div>

    <mail-content v-else-if="showContent" :mail="selectedMail" @delete-mail="bin"></mail-content>

    <div v-else>
      <general-template
        v-for="mail in myBin"
        :key="mail.id"
        :from="mail.from"
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
      myBin: [],
      isLoading: false,
      error: null,
      selectedMail: JSON.stringify(null),
      showContent: false,
    };
  },
  methods: {
    loadContent(mail) {
      this.selectedMail = mail;
      this.showContent = true;
    },
      async bin() {
        const mail = this.selectedMail
      await this.$store.dispatch("mail/deleteMail", mail);
      console.log('delete mail', mail)
      //  window.location.reload();
    },
    async clearBin() {
      await this.$store.dispatch("mail/clearBin");
      //  window.location.reload();

    },
    back() {
      return this.$router.go(-1);
    },
  },

  async mounted() {
    this.isLoading = true;
    try {
      await this.$store.dispatch("mail/loadMail");
      this.myBin = this.$store.getters["mail/getDeleted"];
      this.$router.replace("/bin");
      console.log("mybin", this.myBin);
    } catch (err) {
      this.error = err.message;
    }
    this.isLoading = false;
  },
};
</script>
