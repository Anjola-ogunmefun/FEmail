<template>
  <the-header></the-header>
  <router-view v-slot="slotProps">
    <transition name="route" mode="out-in">
      <component :is="slotProps.Component" class="container md:py-10"></component>
    </transition>
  </router-view>
</template>

<script>
import TheHeader from "./components/BaseComponents/TheHeader.vue";
export default {
  components: { TheHeader },
  data() {
    return {
      error: null,
    };
  },
  computed: {
    didAutoLogout() {
      return this.$store.getters.didAutoLogout;
    },
  },
  async created() {
    this.$store.dispatch("tryLogin");
          await this.$store.dispatch("mail/loadMail");

  },
  watch: {
    didAutoLogout(curValue, oldValue) {
      if (curValue && curValue !== oldValue) {
        this.$router.replace("/login");
      }
    },
  },
};
</script>
<style scoped>
.route-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateX(0px);
}
</style>