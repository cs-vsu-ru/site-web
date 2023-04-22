<template>
  <section class="news-all">
      <h1 class="news-all__title">Новости</h1>
      <div class="news-all__field">
          <div v-for="newsSlide in newsSlider" class="new">
              <img src="../assets/img/new.png" alt="" class="new__image">
              <p class="new__date">3 марта</p>
              <p class="new__text">{{ newsSlide.title }}</p>
          </div>
      </div>
  </section>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const newsSlider = ref([])

onMounted(() => {
    newsList()
})

const newsList = async () => {
    await axios.get('articles')
        .then((news) => {
            newsSlider.value = news.data
        })
}
</script>

<style lang="scss" scoped>
.news-all{
  max-width: 1440px;
  margin: 0 auto 80px;

  &__field{
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    gap: 85px;
  }

  &__title{
    margin-bottom: 40px;
  }
}
</style>