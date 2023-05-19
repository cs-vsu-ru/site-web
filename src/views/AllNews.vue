<template>
  <section class="news-all">
      <h1 class="news-all__title">Новости</h1>
      <div class="news-all__field">
          <router-link :to="'/news/new/' + newsSlide.id" v-for="newsSlide in newsSlider" class="new">
              <img :src="newsSlide.imageURL" alt="" class="new__image">
              <p class="new__date" v-if="newsSlide.publicationDate">{{ new Date(newsSlide.publicationDate).getDate() + ' ' + monthAssoc[newsSlide.publicationDate.split('-').reverse()[1]] }}</p>
              <p class="new__text">{{ newsSlide.title }}</p>
          </router-link>
      </div>
  </section>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const newsSlider = ref([])
const monthAssoc = ref({
    '01': 'января',
    '02': 'февраля',
    '03': 'марта',
    '04': 'апреля',
    '05': 'мая',
    '06': 'июня',
    '07': 'июля',
    '08': 'августа',
    '09': 'сентября',
    '10': 'октября',
    '11': 'ноября',
    '12': 'декабря'
})

onMounted(() => {
    newsList()
})

const newsList = async () => {
    await axios.get('articles')
        .then((news) => {
            newsSlider.value = news.data.reverse()
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