<template>
  <section class="events">
    <h1 class="events__title">Мероприятия</h1>
    <div class="events__field">
      <a href="/" class="event">
        <div class="event__date">
          <p class="event__date-day">19.02 - 25.02</p>
          <p class="event__date-time">12:00</p>
        </div>
        <p class="event__name">Семинар HDI Lab</p>
      </a>
      <a href="/" class="event">
        <div class="event__date">
          <p class="event__date-day">19.02 - 25.02</p>
          <p class="event__date-time">12:00</p>
        </div>
        <p class="event__name">Семинар HDI Lab</p>
      </a>
      <a href="/" class="event">
        <div class="event__date">
          <p class="event__date-day">19.02 - 25.02</p>
          <p class="event__date-time">12:00</p>
        </div>
        <p class="event__name">Семинар HDI Lab</p>
      </a>
      <a href="/" class="event">
        <div class="event__date">
          <p class="event__date-day">19.02 - 25.02</p>
          <p class="event__date-time">12:00</p>
        </div>
        <p class="event__name">Семинар HDI Lab</p>
      </a>
      <a href="/" class="event">
        <div class="event__date">
          <p class="event__date-day">19.02 - 25.02</p>
          <p class="event__date-time">12:00</p>
        </div>
        <p class="event__name">Семинар HDI Lab</p>
      </a>
      <a href="/" class="event">
        <div class="event__date">
          <p class="event__date-day">19.02 - 25.02</p>
          <p class="event__date-time">12:00</p>
        </div>
        <p class="event__name">Семинар HDI Lab</p>
      </a>
    </div>
  </section>
</template>

<script setup>

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
      }

      &:after{
        content: '';
        position: absolute;
        height: 100%;
        width: 2px;
        background: $pr2;
        left: calc(50% - 2px);
      }
    }
  }
}
</style>