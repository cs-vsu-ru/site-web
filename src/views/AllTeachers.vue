<template>
  <section class="teachers-all">
      <h1 class="teachers-all__title">Сотрудники</h1>
      <div class="teachers__field">
          <router-link :to="'/profile/' + teacher.id" v-for="teacher in teachersArr" class="teacher">
              <img :src="teacher.imageUrl" alt="" class="teacher__photo">
              <div class="teacher__data">
                  <p class="teacher__data-name">{{ teacher.lastName + ' ' + teacher.firstName + ' ' + teacher.patronymic}}</p>
                  <p class="teacher__data-status">{{ teacher.post }}</p>
                  <a href="" class="teacher__data-email">{{ teacher.email }}</a>
              </div>
          </router-link>
      </div>
  </section>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

let teachersArr = ref([])

onMounted(() => {
    teacherList()
})

const teacherList = async () => {
    await axios.get('employees')
        .then((req) => {
            teachersArr.value = req.data
        })
}
</script>

<style lang="scss" scoped>
.teachers-all{
    max-width: 1440px;
    margin: 0 auto;

    &__title{
        margin-bottom: 40px;
    }
}
</style>