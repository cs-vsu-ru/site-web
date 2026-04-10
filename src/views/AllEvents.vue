<template>
  <section class="events-all">
    <div v-if="eventsFuture.length > 0" class="events-section">
      <h1 class="section-header__title">Предстоящие мероприятия</h1>
      <div class="events__field">
        <router-link
          v-for="event in eventsFuture"
          :key="event.id"
          :to="'/events/' + event.id"
          class="event"
        >
          <div class="event__date">
            <p class="event__date-day">
              {{ formatDateToString(event.startDateTime) }}
            </p>
            <p class="event__date-time">
              {{ formatTimeToString(event.startDateTime) }}
            </p>
          </div>
          <p class="event__name">{{ event.title }}</p>
        </router-link>
      </div>
    </div>
    <div v-if="eventsPass.length > 0" class="events-section">
      <h1 class="section-header__title">Прошедшие мероприятия</h1>
      <div class="events__field">
        <router-link
          v-for="event in eventsPass"
          :key="event.id"
          :to="'/events/' + event.id"
          class="event"
        >
          <div class="event__date">
            <p class="event__date-day">
              {{ formatDateToString(event.startDateTime) }}
            </p>
            <p class="event__date-time">
              {{ formatTimeToString(event.startDateTime) }}
            </p>
          </div>
          <p class="event__name">{{ event.title }}</p>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const eventsPass = ref([]);
const eventsFuture = ref([]);

onMounted(() => {
  eventList();
});

const formatDateToString = (eventDate) => {
  const dateObject = new Date(eventDate);
  return `${dateObject.getDate().toString().padStart(2, "0")}.${(
    dateObject.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${dateObject.getFullYear()}`;
};

const formatTimeToString = (eventDate) => {
  const dateObject = new Date(eventDate);
  return `${dateObject.getHours().toString().padStart(2, "0")}:${dateObject
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const upcomingEvents = (events) => {
  const currentDate = new Date();
  return events.filter((event) => {
    const startDate = new Date(event.startDateTime);
    return startDate > currentDate;
  });
};

const pastEvents = (events) => {
  const currentDate = new Date();
  return events.filter((event) => {
    const startDate = new Date(event.startDateTime);
    return startDate <= currentDate;
  });
};

const eventList = async () => {
  try {
    const response = await axios.get("events");
    eventsFuture.value = upcomingEvents(response.data);
    eventsPass.value = pastEvents(response.data);
  } catch (error) {
    console.error("Error fetching events:", error);
    eventsFuture.value = [];
    eventsPass.value = [];
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.events-all {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 1480px) {
    max-width: calc(100% - 40px);
  }
}

.events-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.events__field {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 85px;
}

.section-header__title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: $pr1;
}

.event {
  display: flex;
  align-items: center;
  gap: 25px;
  text-decoration: none;
  padding: 10px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
  }

  &__date {
    display: flex;
    align-items: center;
    gap: 10px;

    &-day,
    &-time {
      font-weight: 700;
      color: $pr1;
    }
  }

  &__name {
    font-weight: 700;
    font-size: 20px;
    color: $pr1;
    max-width: 500px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.no-events {
  text-align: center;
  padding: 40px;
  background: $pr3;
  border-radius: 10px;
  color: $sc5;
  font-size: 18px;
}
</style>
