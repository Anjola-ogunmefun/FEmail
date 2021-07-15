<template>
  <main>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>

    <teleport to="body">
      <transition name="modal">
        <confirm-modal
          v-if="confirmModal"
          @close="confirmModal = false"
          @end="saveInbox"
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
        class="w-6 h-6 mt-4 ml-6 md:ml-0"
        @click="back"
      >
        <path d="M15 19l-7-7 7-7"></path>
      </svg>
    </span>
    <h1
      class="text-black font-semibold text-xl md:text-3xl ml-3 md:-ml-3 px-4 mt-4 mb-3"
    >
      Compose
    </h1>

    <div class="-mt-5">
      <base-alert v-if="showSent" @close-alert="showSent = false">
        <h1 class="text-center">Message sent</h1>
      </base-alert>
      <base-alert v-if="showDraft" @close-alert="showDraft = false">
        <h1 class="text-center">Saved to drafts</h1>
      </base-alert>
    </div>

    <section class="grid container antialiased h-screen w-full">
      <div class="w-full mt-6 ">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="flex mb-4 items-center border-b border-gray-700">
            <p class="flex-2 opacity-50 mr-4 mt-3">To</p>
            <div>
              <Multiselect
                v-model="multiSelect.value"
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
              v-model.trim="subject"
            />
          </div>

          <div>
            <QuillEditor
              theme="snow"
              placeholder="Compose mail"
              style="height:200px"
              v-model:content="body"
              class="editor box"
            />

            <p
              v-if="!inputIsValid"
              class="max-w-xs mt-8 text-red-500 md:text-lg"
            >
              Sorry, all fields are required to send; atleast One field is
              required to save to draft!
            </p>

            <div class="grid-flow-row mt-6 container">
              <button
                class="row-span-2 bg-transparent hover:bg-gray-800 text-xs md:text-sm text-black font-semibold hover:text-white py-2 px-6 border border-gray-800 hover:border-transparent rounded-lg"
                @click.prevent="confirmModal = true"
              >
                Send
              </button>
              <button
                class="float-right bg-transparent hover:bg-gray-800 text-xs md:text-sm text-black font-semibold hover:text-white py-2 px-2 border border-gray-800 hover:border-transparent rounded-lg"
                @click.prevent="saveDraft"
              >
                Save to draft
              </button>
            </div>
            <base-spinner v-if="!error && isLoading"></base-spinner>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import BaseDialog from "../../BaseComponents/BaseDialog.vue";
import BaseSpinner from "../../BaseComponents/BaseSpinner.vue";
import BaseAlert from "../../BaseComponents/BaseAlert.vue";
import ConfirmModal from "../../BaseComponents/ConfirmModal.vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  components: {
    BaseSpinner,
    BaseDialog,
    BaseAlert,
    ConfirmModal,
    Multiselect,
    QuillEditor,
  },
  data() {
    return {
      sender: "",
      error: null,
      subject: "",
      body: "",
      isDraft: false,
      inputIsValid: true,
      isLoading: false,
      read: false,
      delete: false,
      showSent: false,
      showDraft: false,
      userRead: [],
      firstDelete: [],
      secondDelete: [],
      userData: [],
      confirmModal: false,
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
    back() {
      return this.$router.go(-1);
    },
    async saveMail(isDraft) {
      this.isLoading = true;

      this.multiSelect.value.forEach((user) => {
        for (const key in this.userData) {
          if (this.userData[key].email === user) {
            const userId = this.userData[key].id;
            let obj = {};
            obj[userId] = false;
            this.userRead.push(obj);
            this.firstDelete.push(obj);
            this.secondDelete.push(obj);
          }
        }
      });

      try {
        this.$store.dispatch("mail/addMail", {
          from: this.sender,
          to: this.multiSelect.value,
          subject: this.subject,
          body: this.body.ops[0].insert,
          draft: isDraft,
          read: this.userRead,
          subDelete: this.firstDelete,
          delete: this.secondDelete,
        });

        this.multiSelect.value = [];
        this.subject = "";
        this.body = document.getElementsByClassName("editor");
        this.body[0].innerHTML = "";
      } catch (err) {
        this.error = err.message;
      }
      this.isLoading = false;
      window.location.reload();
    },

    async saveInbox() {
      this.inputIsValid = true;
      this.confirmModal = false;

      if (
        this.multiSelect.value.length < 1 ||
        this.subject === "" ||
        this.body === ""
      ) {
        this.inputIsValid = false;
        return;
      }

      this.saveMail(false);
      this.showSent = true;
    },

    async saveDraft() {
      if (this.body === "") {
        this.inputIsValid = false;
        return;
      }

      this.saveMail(true);
      this.showDraft = true;
    },

    handleError() {
      this.error = false;
      this.isLoading = false;
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("user/findUser");
      this.sender = this.$store.getters["user/loggedInUser"];

      await this.$store.dispatch("user/loadUsers");
      const allUsers = this.$store.getters["user/allUsers"];

      for (const key in allUsers) {
        this.multiSelect.options.push(allUsers[key].email);
        this.userData.push(allUsers[key]);
      }
    } catch (err) {
      this.error = err.message;
    }
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css">
.box {
  height: 200px;
  width: auto;
}
</style>
