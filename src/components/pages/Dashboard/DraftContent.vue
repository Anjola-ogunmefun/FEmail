<template>
  <main>
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
      >
        <path d="M15 19l-7-7 7-7"></path>
      </svg>
    </span>

    <div class="ml-8 mt-4 mr-8 border h-auto ">
        <span
        @click="$emit('delete-mail', mail)"
        class="float-right p-4  "
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

      <h1 class="text-black font-bold  text-2xl ml-4 px-4 mt-6 mb-2 truncate">
        {{ mail.subject }}
      </h1>
      <span class="flex items-center p-5"
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
        <h1 class="text-xl font-medium px-3 truncate">{{ mail.to[0] }}</h1>
      </span>

      <div class="items-center text-base ml-8 mr-8 mb-8">
         <QuillEditor
              theme="snow"
              placeholder="Compose mail"
              style="height:200px; max-width:32rem;"
              v-model:content="mail.body"
              class="editor box"
            />
        <!-- {{ mail.body }} -->
      </div>

        <button
          class="row-span-2 ml-52 mb-2 bg-transparent hover:bg-gray-800 text-xs md:text-sm text-black font-semibold hover:text-white py-2 px-6 border border-gray-800 hover:border-transparent rounded-lg"
          @click.prevent="$emit('send-mail', mail)"
        >
          Send
        </button>
      </div>
  </main>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  components:[
    QuillEditor
  ],
  props: {
    mail: {
      type: Object,
      required: true,
      default: null,
    },
  },
  methods: {
     back(){
          return this.$router.go(-1)
      }
  }
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
