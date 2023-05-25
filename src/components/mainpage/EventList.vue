<template>
  <section class="events">
    <div class="section-header">
      <h1 class="section-header__title">Мероприятия</h1>
      <router-link class="section-header__link" to="/events">
        Все мероприятия
        <svg width="40" height="9" viewBox="0 0 40 9" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.00908 5.30969H36.3673L33.2593 7.67647C32.8557 7.98789 32.8557 8.48616 33.2593 8.76644C33.663 9.07786 34.3088 9.07786 34.6721 8.76644L39.8789 4.71799C40.0404 4.59343 40.0404 4.40657 39.8789 4.28201L34.6721 0.233564C34.2684 -0.0778547 33.6226 -0.0778547 33.2593 0.233564C32.8557 0.544983 32.8557 1.04325 33.2593 1.32353L36.3673 3.69031H1.00908C0.443996 3.69031 0 4.03287 0 4.46886C0 4.96713 0.443996 5.30969 1.00908 5.30969Z"/>
        </svg>
      </router-link>
    </div>
    <div class="events__field">
      <router-link v-for="event in eventArr.slice(0, 4)" :to="'/events/event/' + event.id" class="event">
        <div class="event__date">
          <p class="event__date-day">{{ event.startDate.split('-').reverse().join('.') }}</p>
          <p class="event__date-time">{{ event.startTime }}</p>
        </div>
        <p class="event__name">{{ event.title }}</p>
      </router-link>
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

<style lang="scss">
@import "./src/assets/styles/variables";

.events{
  max-width: 1440px;
  margin: 80px auto;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (min-width: 1024px) and (max-width: 1480px) {
    max-width: calc(100% - 40px);
  }

  &__field{
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;

    @media (min-width: 1024px) and (max-width: 1480px) {
      justify-content: center;
    }

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