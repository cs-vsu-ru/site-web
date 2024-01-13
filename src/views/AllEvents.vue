<template>
  <section class="events-all">
    <h1 class="section-header__title">Предстоящие мероприятия</h1>
    <div class="events__field">
      <router-link v-for="event in eventsFuture" :to="'/events/event/' + event.id" class="event">
        <div class="event__date">
          <p class="event__date-day">{{ event.startDate.split('-').reverse().join('.') }}</p>
          <p class="event__date-time">{{ event.startTime }}</p>
        </div>
        <p class="event__name">{{ event.title }}</p>
      </router-link>
    </div>
    <h1 class="section-header__title">Прошедшие мероприятия</h1>
    <div class="events__field">
      <router-link v-for="event in eventsPass" :to="'/events/event/' + event.id" class="event">
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

const eventsPass = ref([])
const eventsFuture = ref([])

onMounted(() => {
  eventList()
})

const eventList = async () => {
    await axios.get('events')
        .then((events) => {
            eventsPass.value = events.data.completedEvents
            eventsFuture.value = events.data.upcomingEvents
        })
}
</script>

<style lang="scss" scoped>

.events-all{
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__field{
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    gap: 85px;
  }
}
</style>