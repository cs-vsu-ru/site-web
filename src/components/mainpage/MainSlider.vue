<template>
  <section class="main">
    <div class="section-header">
      <h1 class="section-header__title">Кафедра Информационных систем</h1>
    </div>
    <div class="main__slider">
      <Swiper
          :slides-per-view="1"
          :navigation="{
            prevEl: '.main__slider-nav_button.prev',
            nextEl: '.main__slider-nav_button.next',
          }"
          :modules="[Navigation]"
      >
        <SwiperSlide v-for="slide in slidesArr">
          <a :href="slide.urlTo" class="event">
            <div class="event__text">
              <p class="event__text-name">События</p>
              <p class="event__text-value">{{ slide.title }}</p>
            </div>
            <img :src="slide.imageURL" alt="" class="event__image">
          </a>
        </SwiperSlide>
      </Swiper>
      <div class="main__slider-nav">
        <button type="button" class="main__slider-nav_button prev">
          <svg width="12" height="22" viewBox="0 0 12 22" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.0563 21.6946C10.2691 21.8956 10.5505 22.005 10.8413 21.9998C11.1321 21.9946 11.4096 21.8752 11.6152 21.6667C11.8209 21.4582 11.9387 21.1769 11.9438 20.8821C11.949 20.5873 11.841 20.302 11.6427 20.0863L2.7079 11.0284L11.6427 1.97045C11.753 1.86628 11.8415 1.74065 11.9028 1.60106C11.9642 1.46148 11.9972 1.31079 11.9998 1.158C12.0025 1.00521 11.9748 0.853447 11.9183 0.711754C11.8619 0.570063 11.7778 0.441347 11.6712 0.333292C11.5646 0.225235 11.4377 0.140051 11.2979 0.0828189C11.1582 0.025587 11.0084 -0.00251969 10.8577 0.000177284C10.707 0.00287235 10.5584 0.0363139 10.4207 0.0985087C10.283 0.160704 10.1591 0.250376 10.0563 0.362175L0.328269 10.2242C0.118068 10.4376 9.85532e-07 10.7268 9.59169e-07 11.0284C9.32807e-07 11.3299 0.118068 11.6192 0.328269 11.8325L10.0563 21.6946Z" fill-opacity="0.65"/>
          </svg>
        </button>
        <button type="button" class="main__slider-nav_button next">
          <svg width="12" height="22" viewBox="0 0 12 22" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.94368 0.305408C1.73089 0.104404 1.44946 -0.0050251 1.15867 0.00017633C0.86787 0.00537776 0.590418 0.124804 0.384763 0.333293C0.179107 0.541781 0.0613038 0.823056 0.056173 1.11786C0.0510423 1.41266 0.158985 1.69797 0.357257 1.91368L9.2921 10.9716L0.357257 20.0295C0.246976 20.1337 0.158522 20.2594 0.097172 20.3989C0.0358224 20.5385 0.00283386 20.6892 0.000174686 20.842C-0.00248449 20.9948 0.0252403 21.1466 0.0816944 21.2882C0.138149 21.4299 0.222177 21.5587 0.328764 21.6667C0.435352 21.7748 0.562315 21.86 0.702082 21.9172C0.841849 21.9744 0.991555 22.0025 1.14227 21.9998C1.29298 21.9971 1.44162 21.9637 1.57931 21.9015C1.717 21.8393 1.84092 21.7496 1.94368 21.6378L11.6717 11.7758C11.8819 11.5624 12 11.2732 12 10.9716C12 10.6701 11.8819 10.3808 11.6717 10.1675L1.94368 0.305408Z" fill-opacity="0.65"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper'
import axios from "axios";
import {onMounted, ref} from "vue";

const slidesArr = ref([])

onMounted(() => {
  getSlides()
})

const getSlides = async () => {
  await axios.get('sliders')
      .then((slideData) => {
        slidesArr.value = slideData.data
      })
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/styles.scss";

.main{
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: 1440px;
  margin: 0 auto;

  &__slider{
    width: 100%;
    position: relative;

    .event{
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding-left: 83px;
      background: $pr2;
      border-radius: 10px;

      &__text{
        display: flex;
        flex-direction: column;
        gap: 22px;
        max-width: 505px;

        &-name{
          font-size: 18px;
          line-height: 21px;
          color: white;
        }

        &-value{
          font-size: 32px;
          font-weight: 700;
          line-height: 38px;
          color: white;
        }
      }

      &__image{
        width: 562px;
        height: 416px;
        object-fit: cover;
        border-radius: 0 10px 10px 0;
      }
    }

    &-nav{
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      width: 100%;
      box-sizing: border-box;
      padding: 0 16px;
      top: 45%;
      z-index: 2;

      &_button{
        border: 2px solid $sc5;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 100%;
        background: white;

        &:hover{
          opacity: 0.7;
        }
      }
    }
  }
}
</style>