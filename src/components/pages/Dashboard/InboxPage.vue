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

    <h1 class="text-black font-semibold  text-xl md:text-3xl ml-3 px-4 mt-4 mb-3">Inbox</h1>

    <div v-if="myMail.length === 0 && !isLoading">
      <p class="text-black font-medium text-lg  md:text-2xl px-4 mb-2 mt-24 text-center">
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
</template>

<script>
import MailContent from "./MailContent.vue";
import BaseSpinner from "../../BaseComponents/BaseSpinner.vue";
import BaseTemplate from "../../BaseComponents/BaseTemplate.vue";

export default {
  components: { MailContent, BaseSpinner, BaseTemplate },
  data() {
    return {
      loggedInUser: "",
      myMail: [],
      showContent: false,
      isLoading: false,
      error: null,
      selectedMail: {},
      unreadMail: [],
      readValue: "",
      userData: "",
    };
  },
  methods: {
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
    back() {
      return this.$router.go(-1);
    },
  },
  async mounted() {
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
    } catch (err) {
      this.error = err.message;
    }
    this.isLoading = false;
  },
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
