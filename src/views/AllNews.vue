<template>
  <section class="news-all">
    <h1 class="news-all__title">Новости</h1>
    <div class="news-all__field">
      <div v-for="newsSlide in newsSlider" :key="newsSlide.id" class="new">
        <router-link :to="'/news/new/' + newsSlide.id" class="new__link">
          <div class="new__media">
            <img :src="newsImageSrc(newsSlide.imageLink)"
                 :class="['new__image', { 'new__image--placeholder': isNewsPlaceholder(newsSlide.imageLink) }]"
                 alt=""
                 @error="$event.target.src = logoImg">
            <span class="new__date" v-if="newsSlide.publicationAt">
              {{ new Date(newsSlide.publicationAt).getDate() + ' ' + monthAssoc[newsSlide.publicationAt.split('-').reverse()[1]] }}
            </span>
            <span class="new__arrow" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <p class="new__title">{{ newsSlide.title }}</p>
          <span class="new__accent"></span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { newsImageSrc, isNewsPlaceholder, logoImg } from '@/utils/newsImage'

const newsSlider = ref([])
const monthAssoc = {
  '01': 'января', '02': 'февраля', '03': 'марта', '04': 'апреля',
  '05': 'мая', '06': 'июня', '07': 'июля', '08': 'августа',
  '09': 'сентября', '10': 'октября', '11': 'ноября', '12': 'декабря'
}

onMounted(async () => {
  const res = await axios.get('news')
  newsSlider.value = res.data.reverse()
})
</script>

<style lang="scss" scoped>
.news-all {
  max-width: 1440px;
  margin: 0 auto 80px;

  @media (max-width: 1480px) {
    max-width: calc(100% - 40px);
  }

  &__title {
    margin-bottom: 40px;
  }

  &__field {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
  }
}
</style>
