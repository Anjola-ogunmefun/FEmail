<template>
  <section
    class=" md:h-64 h-34 w-screen bg-no-repeat bg-center bg-cover"
    style="background-image: url('https://blush.design/api/download?shareUri=-eCM1EHmq&bg=e9ecef&w=800&h=800&fm=png');"
  >
    <div class="flex md:mr-36">
      <div class="flex-1">
        <img
          src="../../utils/logo2.png"
          class="md:ml-8 md:mt-40 md:h-24 md:w-40 ml-3 mt-24 w-24 h-12"
          alt="header image"
        />
      </div>
      <ul class="flex mt-28 mb-2 md:mt-56 ml-10">
        <!-- <li class="md:mr-6 mr-0">
          <router-link
            class="bg-black text-white font-serif text-xs md:text-xl px-4 md:px-7 py-2 rounded-full hover:bg-gray-700 hover:-translate-y-1 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-gray-500 active:bg-black"
            to="/"
            v-if="!isLoading && isLoggedIn"
            >Home</router-link
          >
        </li> -->
        <li class="">
          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class=" bg-black text-white font-serif text-xs md:text-xl px-4 md:px-6 py-2 rounded-full hover:bg-gray-700 hover:-translate-y-1 focus:outline-none focus:ring focus:ring-offset-1 focus:ring-gray-500 active:bg-black cursor-pointer"
            >Login</router-link
          >
        </li>
        <li class="mr-6 md:-mr-24">
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
