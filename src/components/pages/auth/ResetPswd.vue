<template>
  <main>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>

    <section
      class="grid justify-evenly container mx-auto  antialiased h-screen  border-l-0 border-t-0 border-r-0 border rounded-6xl border-gray-600 shadow-2xl"
    >
      <h1
        class="md:mt-24 md:px-52 md:mr-32 mt-14 font-serif font-bold antialiased md:text-5xl text-3xl"
      >
        Reset Password
      </h1>

      <h1 class="text-lg md:text-xl max-w-sm md:max-w-md md:ml-52 -mt-20">
        Enter the email associated with your account and we'll send an email
        with instructions to reset your password.
      </h1>

      <div class="md:px-52 md:-mt-12">
        <label
          for="email"
          class="ml-3 font-serif text-2xl font-medium md:text-4xl"
          >Email</label
        >
        <input
          type="email"
          class="md:mt-6 mt-6 border-t-0 border-l-0 border-r-0 w-full focus:outline-none focus:ring-gray-200 px-4 py-5 rounded-full focus:-translate-y-1 transform transition"
          id="email"
          placeholder="Your Email"
          v-model.trim="email"
        />
      </div>

      <p
        v-if="!inputIsValid"
        class="max-w-xs md:ml-52 md:-mt-14 mt-8 text-red-500 md:text-lg"
      >
        Please enter a valid email.
      </p>
      <div>
        <button
          class="md:ml-48 ml-20 md:-mt-4 mt-10 w-1/2 bg-gray-800 hover:bg-gray-700 hover:-translate-y-1 transform transition focus:outline-none focus:ring focus:ring-offset-2 focus:ring-gray-500 active:bg-black text-white font-serif md:text-2xl text-xl rounded-full cursor-pointer"
          @click.prevent="send"
        >
          Send Email
        </button>

        <base-spinner v-if="!error && isLoading"></base-spinner>
      </div>
    </section>
  </main>
</template>

<script>
import BaseDialog from "../../BaseComponents/BaseDialog.vue";
import BaseSpinner from "../../BaseComponents/BaseSpinner.vue";
export default {
  components: {
    BaseDialog,
    BaseSpinner,
  },
  data() {
    return {
      email: "",
      inputIsValid: true,
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async send() {
      if (this.email === "" || !this.email.includes("@")) {
        this.inputIsValid = false;
        return;
      }
      this.isLoading = true;

      try {
        await this.$store.dispatch("user/sendResetEmail", {
          email: this.email,
        });
      } catch (err) {
        this.error = err.message;
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = false;
    },
  },
};
</script>
