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
        Log-in
      </h1>

      <div class="md:px-52">
        <label
          for="email"
          class="ml-3 font-serif text-xl font-medium md:text-3xl"
          >Email</label
        >
        <input
          type="email"
          class="md:mt-6 md:-mb-10 border-t-0 border-l-0 border-r-0 w-full focus:outline-none focus:ring-gray-200 px-4 py-3 rounded-full focus:-translate-y-1 transform transition"
          id="email"
          placeholder="Your Email"
          v-model.trim="email"
        />
      </div>

      <div class="md:px-52">
        <label
          for="password"
          class="ml-3 font-serif text-xl font-medium md:text-3xl"
          >Password</label
        >
        <input
          type="password"
          class="md:mt-6 border-t-0 border-l-0 border-r-0 w-full focus:outline-none focus:ring-gray-200 px-4 py-3 rounded-full focus:-translate-y-1 transform transition"
          id="password"
          placeholder="Your Secretkey"
          v-model.trim="password"
        />

        <p v-if="!inputIsValid" class="max-w-xs mt-8 text-red-500 md:text-lg">
          Please enter a valid email and password (must be at least 6 characters
          long).
        </p>
      </div>
      <div>
        <div class="text-center -mt-16">
          <p>Forgot password? Rest your password</p>
          <router-link to="/reset_pswd" class="underline text-blue-600"
            >here</router-link
          >
        </div>

        <button
          class="md:ml-48 ml-20 mt-8 w-1/2 bg-gray-800 hover:bg-gray-700 hover:-translate-y-1 transform transition focus:outline-none focus:ring focus:ring-offset-2 focus:ring-gray-500 active:bg-black text-white font-serif md:text-2xl text-xl rounded-full cursor-pointer"
          @click.prevent="loginUser"
        >
          Log-in
        </button>
      </div>
      <div class="text-center -mt-24">
        <p>Dont have an account?</p>
        <router-link to="/register" class="underline text-blue-600"
          >sign up</router-link
        >
      </div>

      <base-spinner v-if="!error && isLoading"></base-spinner>
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
      password: "",
      inputIsValid: true,
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async loginUser() {
      this.inputIsValid = true;
      if (
        this.password === "" ||
        this.email === "" ||
        !this.email.includes("@") ||
        this.password.length < 6
      ) {
        this.inputIsValid = false;
        return;
      }
      this.isLoading = true;

      try {
        await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        });

        await this.$store.dispatch("user/findUser");

        this.isLoading = false;

        this.$router.replace("/home");
      } catch (err) {
        this.error = err.message || "Error Logging user in";
      }
    },
    handleError() {
      this.error = null;
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
}
</style>
