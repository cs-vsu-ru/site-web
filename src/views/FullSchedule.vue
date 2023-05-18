<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import Loader from "@/components/includes/Loader";

const example = ref()
const isLoading = ref(false)

onMounted( () => {
  schedule()
})

const schedule = async () => {
  isLoading.value = true

  await axios.get('filterTimetableForChair', {
    params: {
      employeeNames: 'Борисов, Коваль, Савинков, Ермаков'
    }
  })
      .then((scheduleData) => {
        example.value = scheduleData.data
        isLoading.value = false
      })
}
</script>

<template>
  <section class="full-schedule">
    <h1>Расписание</h1>
    <div v-if="example" v-html="example">

    </div>
  </section>
  <Loader v-if="isLoading"/>
</template>

<style lang="scss" scoped>
.full-schedule{
  max-width: 1440px;
  margin: 0 auto;

  h1{
    margin-bottom: 30px;
  }
}
</style>