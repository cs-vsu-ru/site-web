<template>
  <section class="events">
    <h1 class="events__title">Мероприятия</h1>
    <div class="events__field">
      <a v-for="event in eventArr" href="/" class="event">
        <div class="event__date">
          <p class="event__date-day">{{ event.publicationDate.split('T')[0].split('-')[2] + '.' + event.publicationDate.split('T')[0].split('-')[1] + '.' + event.publicationDate.split('T')[0].split('-')[0] }}</p>
          <p class="event__date-time">{{ event.publicationDate.split('T')[1].slice(0, 5) }}</p>
        </div>
        <p class="event__name">{{ event.content }}</p>
      </a>
    </div>
  </section>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const eventArr = ref([])

onMounted(() => {
    eventList()
})

const eventList = async () => {
    await axios.get('events')
        .then((events) => {
            eventArr.value = events.data
        })
}
</script>

<style lang="scss" scoped>
@import "./src/assets/styles/variables";

.events{
  max-width: 1440px;
  margin: 80px auto;
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__field{
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;

    .event{
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
      gap: 40px;
      background: $pr3;
      max-width: 680px;
      width: 100%;
      border-radius: 10px;
      position: relative;

      &__date{
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        gap: 14px;

        &-day{
          font-size: 36px;
          font-weight: 500;
          line-height: 42px;
        }

        &-time{
          font-size: 30px;
          line-height: 35px;
          color: $pr1;
        }
      }

      &__name{
        font-size: 30px;
        line-height: 35px;
        max-width: 200px;
        width: 100%;
      }

      &:after{
        content: '';
        position: absolute;
        height: 100%;
        width: 2px;
        background: $pr2;
        left: calc(48% - 2px);
      }
    }
  }
}
</style>