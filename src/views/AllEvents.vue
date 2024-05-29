<template>
  <section class="events-all">
    <div v-if="eventsFuture.length > 0">
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
    </div>
    <div v-if="eventsPass.length > 0">
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
    </div>
  </section>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const eventsPass = ref([])
const eventsFuture = ref([])
const currentDate = new Date();
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

const upcomingEvents = (events) => {
  return events.filter(event => {
    const startDate = new Date(event.startDateTime);
    return startDate > currentDate;
  });
};

const pastEvents = (events) => {
  return events.filter(event => {
    const startDate = new Date(event.startDateTime);
    return startDate <= currentDate;
  });
};
const eventList = async () => {
  await axios.get('events')
      .then((events) => {
        eventsPass.value = pastEvents(events.data)
        eventsFuture.value = upcomingEvents(events.data)
      })
}
</script>

<style lang="scss" scoped>

.events-all {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__field {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    gap: 85px;
  }
}
</style>