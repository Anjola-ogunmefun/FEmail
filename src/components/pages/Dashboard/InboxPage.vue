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

    <h1 class="text-black font-semibold  text-xl ml-3 px-4 mt-4 mb-3">Inbox</h1>

    <div v-if="myMail.length === 0 && !isLoading">
      <p class="text-black font-medium text-lg px-4 mb-2 mt-24 text-center">
        No mail for you yet!
      </p>
    </div>

    <transition
      v-else-if="showContent"
      enter-active-class="animate__animated animate__bounce "
      leave-active-class="animate__animated animate__slideInUp"
    >
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
      isRead: "",
      userData: "",
    };
  },
  methods: {
    async loadContent(mail) {
      this.selectedMail = mail;
      this.showContent = true;
      await this.$store.dispatch("mail/removeUnread", mail);
    },
    async bin(mail) {
      await this.$store.dispatch("mail/deleteMail", mail);
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
      console.log({ inbox });
      this.loggedInUser = this.$store.getters["user/loggedInUser"];

      for (const key in allUsers) {
        if (this.loggedInUser === allUsers[key].email)
          this.userData = allUsers[key].id;
      }
      console.log("id", this.userData);

      for (let i = 0; i < inbox.length; i++) {
        inbox[i].to.forEach((person) => {
          if (person === this.loggedInUser) {
            this.myMail.push(inbox[i]);
          }
        });
        console.log("this mail", this.myMail);
      }
      for (let i = 0; i < this.myMail.length; i++) {
        this.myMail[i].read.forEach((recepient) => {
          for(const key in recepient){
            console.log("rec", recepient[key])
             if(this.userData === key && recepient[key] === false){
               this.unreadMail.push(this.myMail[i])
             }
          }
        // if(this.userData === recepient ){
          console.log('key',recepient)

          // }
        });
      }
    } catch (err) {
      this.error = err.message;
    }
    this.isLoading = false;
    console.log("mymail", this.myMail);
    console.log("unread", this.unreadMail);
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
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
