<template>
  <button @click="anime">toggle</button>

  <transition
    v-if="show"
    name="custom-classes-transition"
    enter-active-class="animate__animated animate__bounce "
    leave-active-class="animate__animated animate__slideInUp"
  >
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam possimus
      iusto quas nulla dolor aperiam accusamus assumenda, placeat exercitationem
      blanditiis molestias optio rerum ab. Molestiae est recusandae rem suscipit
      dicta.
    </p>
  </transition>

 
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    anime() {
      this.show = !this.show;
    },
  },
};
</script>
