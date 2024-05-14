<template>
  <section class="events-all">
    <h1 class="section-header__title">Предстоящие мероприятия</h1>
    <div class="events__field">
      <router-link v-for="event in eventsFuture" :to="'/events/' + event.id" class="event">
        <div class="event__date">
          <p class="event__date-day">{{ formatDateToString(event.startDateTime) }}</p>
          <p class="event__date-time">{{ formatTimeToString(event.startDateTime) }}</p>
        </div>
        <p class="event__name">{{ event.title }}</p>
      </router-link>
    </div>
    <h1 class="section-header__title">Прошедшие мероприятия</h1>
    <div class="events__field">
      <router-link v-for="event in eventsPass" :to="'/events/' + event.id" class="event">
        <div class="event__date">
          <p class="event__date-day">{{ formatDateToString(event.startDateTime) }}</p>
          <p class="event__date-time">{{ formatTimeToString(event.startDateTime) }}</p>
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

const formatDateToString = (eventDate) => {
  const dateObject = new Date(eventDate);
  return `${dateObject.getDate().toString().padStart(2, "0")}.${(
      dateObject.getMonth() + 1
  )
      .toString()
      .padStart(2, "0")}.${dateObject.getFullYear()}`;
}

const formatTimeToString = (eventDate) => {
  const dateObject = new Date(eventDate);
  return `${dateObject
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateObject
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

}

const eventList = async () => {
  await axios.get('events')
      .then((events) => {
        events.data.forEach((event) => {
          console.log(event.startDateTime)
          const startDateTime = new Date(event.startDateTime);
          const endDateTime = event.endDateTime ? new Date(event.endDateTime) : null;

          if (endDateTime === null) {
            upcomingEvents.push(event);
          } else if (endDateTime < currentDate) {
            pastEvents.push(event);
          } else if (startDateTime < currentDate && endDateTime >= currentDate) {
            pastEvents.push(event);
          } else {
            upcomingEvents.push(event);
          }
        })
        eventsPass.value = pastEvents
        eventsFuture.value = upcomingEvents

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