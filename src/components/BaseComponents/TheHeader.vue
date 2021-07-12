<template>
  <section
    class=" md:h-64 h-36 w-screen bg-no-repeat bg-center bg-cover"
    style="background-image: url('https://blush.design/api/download?shareUri=-eCM1EHmq&bg=e9ecef&w=800&h=800&fm=png');"
  >
    <div class="flex md:mr-36">
      <div class="flex-1">
        <img
          src="../../utils/undraw.svg"
          class="md:ml-8 md:h-56 md:mt-4 md:w-56  h-44"
          alt="header image"
        />
      </div>
      <ul class="flex mt-28 md:mt-52 ml-10">
        <!-- <li class="md:mr-6 mr-0">
          <router-link
            class="bg-black text-white font-serif text-xs md:text-xl px-4 md:px-7 py-2 rounded-full hover:bg-gray-700 hover:-translate-y-1 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-gray-500 active:bg-black"
            to="/"
            v-if="!isLoading && isLoggedIn"
            >Home</router-link
          >
        </li> -->
        <li class="mr-6">
          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class=" bg-black text-white font-serif text-xs md:text-xl px-4 md:px-6 py-2 rounded-full hover:bg-gray-700 hover:-translate-y-1 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-gray-500 active:bg-black cursor-pointer"
            >Login</router-link
          >
        </li>
        <li class="mr-6">
          <a class=" bg-black text-white font-serif text-xs md:text-xl px-4 md:px-6 py-2 rounded-full hover:bg-gray-700 hover:-translate-y-1 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-gray-500 active:bg-black cursor-pointer"
            v-if="!isLoading && isLoggedIn"
            @click="logout">
            Logout
          </a>
          
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  props: ["isLoading"],
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.replace("/login");
    },
  },
};
</script>
