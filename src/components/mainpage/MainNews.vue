<template>
  <section class="news">
    <div class="news__container">
      <div class="section-header">
        <h1 class="section-header__title">Новости</h1>
        <router-link class="section-header__link" to="/news">
          Все новости
          <svg width="40" height="9" viewBox="0 0 40 9" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.00908 5.30969H36.3673L33.2593 7.67647C32.8557 7.98789 32.8557 8.48616 33.2593 8.76644C33.663 9.07786 34.3088 9.07786 34.6721 8.76644L39.8789 4.71799C40.0404 4.59343 40.0404 4.40657 39.8789 4.28201L34.6721 0.233564C34.2684 -0.0778547 33.6226 -0.0778547 33.2593 0.233564C32.8557 0.544983 32.8557 1.04325 33.2593 1.32353L36.3673 3.69031H1.00908C0.443996 3.69031 0 4.03287 0 4.46886C0 4.96713 0.443996 5.30969 1.00908 5.30969Z"/>
          </svg>
        </router-link>
      </div>
      <div class="news__field">
        <Swiper
          :slides-per-view="4"
          :space-between="30"
          :navigation="{ prevEl, nextEl }"
          :modules="[Navigation]"
        >
          <SwiperSlide v-for="newsSlide in newsSlider" :key="newsSlide.id">
            <div class="new">
              <router-link :to="'/news/new/' + newsSlide.id" class="new__link">
                <div class="new__media">
                  <img :src="newsImageSrc(newsSlide.imageLink)"
                       :class="['new__image', { 'new__image--placeholder': isNewsPlaceholder(newsSlide.imageLink) }]"
                       alt=""
                       @error="$event.target.src = logoImg">
                  <span class="new__date">
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
          </SwiperSlide>
        </Swiper>
        <div class="slider-nav">
          <button ref="prevEl" type="button" class="slider-nav__button">
            <svg width="12" height="22" viewBox="0 0 12 22" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.0563 21.6946C10.2691 21.8956 10.5505 22.005 10.8413 21.9998C11.1321 21.9946 11.4096 21.8752 11.6152 21.6667C11.8209 21.4582 11.9387 21.1769 11.9438 20.8821C11.949 20.5873 11.841 20.302 11.6427 20.0863L2.7079 11.0284L11.6427 1.97045C11.753 1.86628 11.8415 1.74065 11.9028 1.60106C11.9642 1.46148 11.9972 1.31079 11.9998 1.158C12.0025 1.00521 11.9748 0.853447 11.9183 0.711754C11.8619 0.570063 11.7778 0.441347 11.6712 0.333292C11.5646 0.225235 11.4377 0.140051 11.2979 0.0828189C11.1582 0.025587 11.0084 -0.00251969 10.8577 0.000177284C10.707 0.00287235 10.5584 0.0363139 10.4207 0.0985087C10.283 0.160704 10.1591 0.250376 10.0563 0.362175L0.328269 10.2242C0.118068 10.4376 9.85532e-07 10.7268 9.59169e-07 11.0284C9.32807e-07 11.3299 0.118068 11.6192 0.328269 11.8325L10.0563 21.6946Z" fill-opacity="0.65"/>
            </svg>
          </button>
          <button ref="nextEl" type="button" class="slider-nav__button">
            <svg width="12" height="22" viewBox="0 0 12 22" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.94368 0.305408C1.73089 0.104404 1.44946 -0.0050251 1.15867 0.00017633C0.86787 0.00537776 0.590418 0.124804 0.384763 0.333293C0.179107 0.541781 0.0613038 0.823056 0.056173 1.11786C0.0510423 1.41266 0.158985 1.69797 0.357257 1.91368L9.2921 10.9716L0.357257 20.0295C0.246976 20.1337 0.158522 20.2594 0.097172 20.3989C0.0358224 20.5385 0.00283386 20.6892 0.000174686 20.842C-0.00248449 20.9948 0.0252403 21.1466 0.0816944 21.2882C0.138149 21.4299 0.222177 21.5587 0.328764 21.6667C0.435352 21.7748 0.562315 21.86 0.702082 21.9172C0.841849 21.9744 0.991555 22.0025 1.14227 21.9998C1.29298 21.9971 1.44162 21.9637 1.57931 21.9015C1.717 21.8393 1.84092 21.7496 1.94368 21.6378L11.6717 11.7758C11.8819 11.5624 12 11.2732 12 10.9716C12 10.6701 11.8819 10.3808 11.6717 10.1675L1.94368 0.305408Z" fill-opacity="0.65"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { newsImageSrc, isNewsPlaceholder, logoImg } from '@/utils/newsImage'

const prevEl = ref(null)
const nextEl = ref(null)
const newsSlider = ref([])
const monthAssoc = {
  '01': 'января', '02': 'февраля', '03': 'марта', '04': 'апреля',
  '05': 'мая', '06': 'июня', '07': 'июля', '08': 'августа',
  '09': 'сентября', '10': 'октября', '11': 'ноября', '12': 'декабря'
}

onMounted(async () => {
  const res = await axios.get('news')
  newsSlider.value = res.data.reverse().slice(0, 8)
})
</script>

<style lang="scss">
@import "../../assets/styles/styles.scss";

.news {
  background: $pr3;
  padding: 80px 0;

  &__container {
    max-width: 1440px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 40px;

    @media (max-width: 1480px) {
      max-width: calc(100% - 40px);
    }
  }

  &__field {
    width: 100%;
    position: relative;

    .slider-nav {
      pointer-events: none;

      &__button {
        pointer-events: auto;
      }
    }
  }
}

.new {
  display: block;
  width: 100%;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.25s ease;
  box-shadow: 0 0 0 transparent;

  &__link {
    display: block;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  &__media {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;

    &--placeholder {
      object-fit: contain;
      padding: 20px;
      background: white;
    }
  }

  &__date {
    position: absolute;
    top: 12px;
    right: 12px;
    background: $pr2;
    color: white;
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
    padding: 7px 12px;
    border-radius: 20px;
    letter-spacing: 0.2px;
    box-shadow: 0 2px 6px rgba(0, 41, 95, 0.18);
    pointer-events: none;
  }

  &__arrow {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: $pr2;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
  }

  &__title {
    padding: 20px;
    font-size: 20px;
    line-height: 26px;
    color: $pr1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
    min-height: calc(26px * 3 + 40px);
    box-sizing: border-box;
  }

  &__accent {
    display: block;
    height: 2px;
    width: 40px;
    background: $pr2;
    margin: 0 20px 20px;
    transition: width 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

    .new__arrow {
      opacity: 1;
      transform: translateY(0);
    }

    .new__accent {
      width: 80px;
    }
  }
}
</style>
