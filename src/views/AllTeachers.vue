<template>
  <section class="teachers-all">
      <h1 class="teachers-all__title">Сотрудники</h1>
      <div class="teachers__field">
          <router-link :to="'/profile/' + teacher.id" v-for="teacher in teachersArr" class="teacher">
              <img :src="teacher.imageUrl" alt="" class="teacher__photo">
              <div class="teacher__data">
                  <p class="teacher__data-name">{{ teacher.lastName }} <br> {{ teacher.firstName }} <br> {{ teacher.patronymic}}</p>
                  <p class="teacher__data-status">{{ teacher.post }}</p>
                  <a href="" class="teacher__data-email">{{ teacher.email }}</a>
              </div>
          </router-link>
      </div>
  </section>
  <Loader v-if="isLoading" />
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import Loader from "@/components/includes/Loader";

let teachersArr = ref([])
const isLoading = ref(false)

onMounted(() => {
    teacherList()
})

const teacherList = async () => {
    isLoading.value = true

    await axios.get('employees')
        .then((req) => {
            teachersArr.value = req.data
            isLoading.value = false
        })
}
</script>

<style lang="scss" scoped>
.teachers-all{
    max-width: 1440px;
    margin: 0 auto;

    @media (max-width: 1480px) {
      max-width: calc(100% - 40px);
    }

    &__title{
        margin-bottom: 40px;
    }
}
</style>