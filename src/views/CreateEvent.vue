<script setup>
import {ref} from "vue";
import axios from "axios";

const eventName = ref()
const eventDay = ref()
const eventTime = ref()
const eventDesc = ref()

const createEvent = async () => {
  await axios.post('events', {
    content: eventDesc.value,
    startDate: eventDay.value,
    startTime: eventTime.value,
    title: eventName.value
  })
}
</script>

<template>
  <section class="create-event">
    <h1>Создать мероприятие</h1>
    <div class="create-event__field">
      <div class="body">
        <div class="body__item">
          <p class="body__item-name">Название</p>
          <textarea v-model="eventName" class="body__item-area"></textarea>
        </div>
        <div style="align-self:flex-start;" class="body__item">
          <p class="body__item-name">Дата проведения</p>
          <input v-model="eventDay" class="body__item-date" type="date">
          <input v-model="eventTime" class="body__item-date" type="time">
        </div>
        <div class="body__item">
          <p class="body__item-name">Описание</p>
          <textarea v-model="eventDesc" class="body__item-area desc"></textarea>
        </div>
      </div>
    </div>
    <div class="create-event__buttons">
      <button @click="createEvent" class="create-event__buttons-item">Создать</button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.create-event{
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__field{
    background: $pr3;
    border-radius: 10px;
    display: flex;
    align-items: stretch;
  }

  .body{
    padding: 30px 42px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 30px;

    &__item{
      display: flex;
      flex-direction: column;
      gap: 20px;

      &-name{
        font-size: 30px;
        line-height: 35px;
        color: $pr1;
      }

      &-area{
        resize: none;
        background: $sc3;
        border-radius: 10px;
        height: 68px;
        padding: 7px 10px;
        font-size: 18px;
        line-height: 21px;

        &.desc{
          height: 170px;
        }
      }

      &-date{
        font-size: 20px;
      }
    }
  }

  &__buttons{
    background: $pr3;
    border-radius: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 25px 0;

    &-item{
      font-size: 24px;
      color: $pr1;
      background: $sc3;
      width: 265px;
      padding: 6px 0;
      border-radius: 10px;

      &:hover{
        background: $pr1;
        color: white;
      }
    }
  }
}
</style>