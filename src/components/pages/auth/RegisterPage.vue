<template>
  <main>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>

    <div
      class="container text-center bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative"
      role="alert"
      v-if="alert"
    >
      <strong class="font-bold">New User Registered Successfully!</strong>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg
          class="fill-current h-6 w-6 text-gray-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title @click="showAlert">Close</title>
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </span>
    </div>

    <section
      class="grid justify-evenly container mx-auto  antialiased h-screen  border-l-0 border-t-0 border-r-0 border rounded-6xl border-gray-600 shadow-2xl"
    >
      <h1
        class="md:mt-24 md:px-52 md:mr-32 mb-8 mt-14 font-serif font-bold antialiased md:text-5xl text-3xl"
      >
        Register
      </h1>

      <div class="md:px-52">
        <label
          for="firstname"
          class="ml-3 font-serif text-xl font-medium md:text-3xl "
          >First name</label
        >
        <input
          type="text"
          class="md:mt-6 border-t-0 border-l-0 border-r-0 w-full focus:outline-none focus:ring-gray-200 px-4 py-3 rounded-full"
          id="firstname"
          placeholder="Your First name"
          v-model.trim="firstName"
        />
      </div>

      <div class="md:px-52">
        <label
          for="lastname"
          class="ml-3 font-serif text-xl font-medium md:text-3xl"
          >Last name</label
        >
        <input
          type="text"
          class="md:mt-6 border-t-0 border-l-0 border-r-0 w-full focus:outline-none focus:ring-gray-200 px-4 py-3 rounded-full"
          id="lastname"
          placeholder="Your Last name"
          v-model.trim="lastName"
        />
      </div>

      <div class="md:px-52">
        <label
          for="email"
          class="ml-3 font-serif text-xl font-medium md:text-3xl"
          >Email</label
        >
        <input
          type="email"
          class="md:mt-6 border-t-0 border-l-0 border-r-0 w-full focus:outline-none focus:ring-gray-200 px-4 py-3 rounded-full"
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
          class="md:mt-6 border-t-0 border-l-0 border-r-0 w-full focus:outline-none focus:ring-gray-200 px-4 py-3 rounded-full"
          id="password"
          placeholder="Your Secretkey"
          v-model.trim="password"
        />
        <p v-if="!inputIsValid" class="max-w-xs mt-8 text-red-500 md:text-lg">
          Please enter a valid names, email and password (must be at least 6
          characters long).
        </p>
      </div>
      <div>
        <button
          class="md:ml-48 ml-20 mt-10 w-1/2 bg-gray-800 hover:bg-gray-700 hover:-translate-y-1  transform transition focus:outline-none focus:ring focus:ring-offset-2 focus:ring-gray-500 active:bg-black text-white font-serif md:text-2xl text-xl rounded-full cursor-pointer"
          @click.prevent="saveUser()"
        >
          Submit
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      inputIsValid: true,
      isLoading: false,
      error: null,
      alert: false,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    async saveUser() {
      this.inputIsValid = true;
      if (
        this.firstName === "" ||
        this.lastName === "" ||
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
        await this.$store.dispatch("signup", {
          email: this.email,
          password: this.password,
        });

        await this.$store.dispatch("user/addUser", {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          displayName: this.firstName,
        });
        this.isLoading = false;
        this.alert = true;
        this.firstName = "";
        this.lastName = "";
        this.password = "";
        this.email = "";

        this.$router.replace("/login");
      } catch (err) {
        this.error = err.message || "Error creating new user";
      }
    },
    handleError() {
      this.error = null;
      this.isLoading = false;
    },
    showAlert() {
      this.alert = false;
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
}
</style>
