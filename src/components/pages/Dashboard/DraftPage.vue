<template>
  <section>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>

    <teleport to="body">
      <transition name="modal">
        <confirm-modal
          v-if="confirmModal"
          @close="confirmModal = false"
          @end="sendMail"
        ></confirm-modal>
      </transition>
    </teleport>

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

    <h1 class="text-black font-semibold  text-xl md:text-3xl ml-3 px-4 mt-4 mb-3">
      Drafts
    </h1>

    <span v-if="showContent">
      <svg
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        class="w-6 h-6 mt-4 ml-6"
        @click="back"
      >
        <path d="M15 19l-7-7 7-7"></path>
      </svg>
    </span>

    <div v-if="showContent" class="ml-8 mt-4 mr-8 border-none h-auto">
      <span @click="bin" class="float-right"
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
      </span>
    </div>
    <base-alert v-if="showAlert" @close-alert="showAlert = false">
      <h1 class="text-center">Message sent</h1>
    </base-alert>

    <div v-if="myDraft.length === 0 && !isLoading">
      <p class="text-black font-medium text-lg md:text-2xl px-4 mb-2 mt-24 text-center">
        Draft is empty!
      </p>
    </div>

    <form
      v-else-if="showContent"
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div class="flex mb-4 items-center border-b border-gray-700">
        <p class="flex-2 opacity-50 mr-4 mt-3">To</p>
        <div>
          <Multiselect
            v-model="selectedMail.to"
            v-bind="multiSelect"
            class="flex-1 appearance-none border-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            :classes="{
              tag:
                'bg-gray-200 text-black text-sm font-semibold py-1 pl-2 rounded mr-1 mb-1 inline-block flex items-center whitespace-nowrap',
              containerActive: 'ring ring-black ring-opacity-10',
            }"
          ></Multiselect>
        </div>
        <div class="mb-6 flex items-center border-b border-gray-700"></div>
      </div>

      <div class="mb-4 flex items-center border-b border-gray-700">
        <label for="sender" class="inline opacity-50">From</label>
        <input
          class="appearance-none border-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-gray-200"
          id="sender"
          type="text"
          v-model="sender"
          disabled
        />
      </div>

      <div class="mb-4 flex items-center border-b border-gray-700">
        <label for="subject" class="inline opacity-50">Subject</label>
        <input
          class="appearance-none bg-transparent border-none w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-gray-50"
          type="text"
          id="subject"
          v-model.trim="selectedMail.subject"
        />
      </div>

      <div>
        <QuillEditor
          theme="snow"
          placeholder="Compose mail"
          style="height:200px;"
          @ready="onEditorReady($event)"
          v-model:content="body"
          class="editor box"
        />

        <p v-if="!inputIsValid" class="max-w-xs mt-8 text-red-500 md:text-lg">
          Sorry, all fields are required to send; atleast One field is required
          to save to draft!
        </p>

        <div class="grid-flow-row mt-6 container">
          <button
            class="row-span-2 bg-transparent hover:bg-gray-800 text-xs md:text-sm text-black font-semibold hover:text-white py-2 px-6 border border-gray-800 hover:border-transparent rounded-lg"
            @click.prevent="confirmModal = true"
          >
            Send
          </button>
        </div>
        <base-spinner v-if="!error && isLoading"></base-spinner>
      </div>
    </form>

    <div v-else>
      <general-template
        v-for="mail in myDraft"
        :key="mail.id"
        :to="mail.to[0]"
        :subject="mail.subject"
        :body="mail.body"
        @click="loadContent(mail)"
      ></general-template>
    </div>
    <base-spinner v-if="isLoading"></base-spinner>
  </section>
</template>

<script>
import GeneralTemplate from "../../BaseComponents/GeneralTemplate.vue";
import BaseSpinner from "../../BaseComponents/BaseSpinner.vue";
import BaseDialog from "../../BaseComponents/BaseDialog.vue";
import BaseAlert from "../../BaseComponents/BaseAlert.vue";
import ConfirmModal from "../../BaseComponents/ConfirmModal.vue";
import Multiselect from "@vueform/multiselect";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  components: {
    GeneralTemplate,
    BaseSpinner,
    BaseDialog,
    BaseAlert,
    ConfirmModal,
    Multiselect,
    QuillEditor,
  },
  data() {
    return {
      loggedInUser: "",
      myDraft: [],
      isLoading: false,
      error: null,
      selectedMail: JSON.stringify(null),
      showContent: false,
      showAlert: false,
      inputIsValid: true,
      confirmModal: false,
      body: "",
      sender: "",
      multiSelect: {
        mode: "tags",
        value: [],
        filterResults: true,
        minChars: 1,
        resolveOnLoad: true,
        delay: 0,
        searchable: true,
        createTag: true,
        multiple: true,
        options: [],
      },
    };
  },
  methods: {
    loadContent(mail) {
      this.selectedMail = mail;
      this.showContent = true;
      this.body = this.selectedMail.body;
    },
    onEditorReady(e) {
      e.container.querySelector(".ql-blank").innerHTML = this.selectedMail.body;
    },
    async bin(mail) {
      await this.$store.dispatch("mail/firstDelete", mail);
      window.location.reload();
    },
    handleError() {
      this.error = null;
    },
    back() {
      return this.$router.go(-1);
    },
    async sendMail() {
      this.isLoading = true;
      this.inputIsValid = true;
      this.confirmModal = false;

      if (
        this.selectedMail.to.length < 1 ||
        this.subject === "" ||
        this.body === ""
      ) {
        this.inputIsValid = false;
        return;
      }
      const mail = this.selectedMail;
      try {
        await this.$store.dispatch("mail/removeDraft", mail);

        this.showAlert = true;

        this.multiSelect.value = [];
        this.subject = "";
        this.body = document.getElementsByClassName("editor");
        this.body[0].innerHTML = "";

        window.location.reload();
      } catch (err) {
        this.error = err.message;
      }
      this.isLoading = false;
    },
  },

  async mounted() {
    this.isLoading = true;
    this.body = document.getElementsByClassName("editor");
    this.body = this.selectedMail.body;

    try {
      await this.$store.dispatch("mail/loadMail");
      await this.$store.dispatch("user/findUser");
      const draft = this.$store.getters["mail/getDraft"];
      this.loggedInUser = this.$store.getters["user/loggedInUser"];
      for (let i = 0; i < draft.length; i++) {
        if (draft[i].from === this.loggedInUser) {
          this.myDraft.push(draft[i]);
        }
      }

      // fetch logged in user
      await this.$store.dispatch("user/findUser");
      this.sender = this.$store.getters["user/loggedInUser"];

      await this.$store.dispatch("user/loadUsers");
      const allUsers = this.$store.getters["user/allUsers"];
      allUsers.forEach((user) => {
        this.multiSelect.options.push(user.email);
      });
    } catch (err) {
      this.error = err.message;
    }

    this.isLoading = false;
  },
  handleError() {
    this.error = null;
    this.isLoading = false;
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css">
.box {
  width: auto;
}
</style>
