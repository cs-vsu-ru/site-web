<template>
  <section class="schedule" v-if="destination">
      <h1 class="schedule__title">Расписание</h1>
      <h3 style="font-size: 26px">{{ destination.user.lastName + ' ' + destination.user.firstName + ' ' + destination.patronymic }}</h3>
      <table class="schedule__table">
          <thead>
            <tr>
                <th>Время</th>
                <th>Понедельник</th>
                <th>Вторник</th>
                <th>Среда</th>
                <th>Четверг</th>
                <th>Пятница</th>
                <th>Суббота</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td>8:00 - 9:35</td>
            </tr>
            <tr>
                <td>9:45 - 11:20</td>
            </tr>
            <tr>
                <td>11:30 - 13:05</td>
            </tr>
            <tr>
                <td>13:25 - 15:00</td>
            </tr>
            <tr>
                <td>15:10 - 16:45</td>
            </tr>
            <tr>
                <td>16:55 - 18:30</td>
            </tr>
            <tr>
                <td>18:40 - 20:00</td>
            </tr>
            <tr>
                <td>20:10 - 21:30</td>
            </tr>
          </tbody>
      </table>
  </section>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";

const accountInfo = ref([])
const route = useRoute()

const destinationId = computed(() => route.params.id)
const destination = computed(() => {
    return accountInfo.value.find(item => item.id == destinationId.value)
})

onMounted(async () => {
    schedule()
    await axios.get('lessons')
})

const schedule = async () => {
    await axios.get('employees')
        .then((accId) => {
            console.log(accId)
            accountInfo.value = accId.data
        })
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.schedule{
  max-width: 1440px;
  margin: 0 auto;

  &__table{
    border: 3px solid $pr1;
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    table-layout: fixed;
    
    td, th{
      text-align: center;
      font-size: 20px;
      line-height: 24px;
      border: 1px solid $pr1;
      border-collapse: collapse;
      padding: 15px 0;
    }
  }
}
</style>