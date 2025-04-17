<template>
  <div class="teachers__field">
    <router-link :to="'/profile/' + teacher.id" v-for="teacher in teachersArr" class="teacher">
      <img :src="teacher.imageUrl" alt="" class="teacher__photo">
      <div class="teacher__data">
        <p class="teacher__data-name">{{ teacher.lastName }} <br> {{ teacher.firstName }} <br> {{ teacher.patronymic }}
        </p>
        <p class="teacher__data-status">{{ teacher.post }}</p>
        <a href="" class="teacher__data-email">{{ teacher.email }}</a>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

let teachersArr = ref([]);
const isLoading = ref(false);

const teacherList = async () => {
  isLoading.value = true;
  await axios.get('employees')
      .then((req) => {
        teachersArr.value = req.data;
        isLoading.value = false;
      });
};

onMounted(() => {
  teacherList();
})
</script>

<style lang="scss" scoped>

</style>
