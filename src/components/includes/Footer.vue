<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__container-left">
        <nav class="footer-nav">
          <router-link class="footer-nav__item hover-underline" to="/">Адреса и контакты</router-link>
          <router-link class="footer-nav__item hover-underline" to="/">Условия использования материалов</router-link>
          <router-link class="footer-nav__item hover-underline" to="/">Политика конфиденциальности</router-link>
          <router-link class="footer-nav__item hover-underline" to="/">Карта сайта</router-link>
        </nav>
        <div class="footer-info">
          <p class="footer-info__item">©Воронежский Государственный Университет 1997-2023 Все права защищены</p>
          <p class="footer-info__item">При использовании материала ссылка обязательна</p>
        </div>
      </div>
      <router-link class="footer-logo" to="/">
        <img src="./../../assets/img/footer-logo.png" alt="" class="footer-logo__image">
      </router-link>
    </div>
  </footer>
</template>

<script setup>

</script>

<style lang="scss" scoped>
  @import "@/assets/styles/_variables.scss";

  .footer{
    background: white;
    width: 100%;
    margin-top: auto;

    &__container{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      max-width: 1440px;
      margin: 0 auto;
      padding: 35px 0;

      &-left{
        display: flex;
        flex-direction: column;
        gap: 35px;

        .footer-nav{
          display: flex;
          align-items: center;
          gap: 18px;

          &__item{
            font-size: 18px;
            line-height: 21px;
            color: $pr1;
            position: relative;

            &:not(:last-child):before{
              content: '';
              position: absolute;
              height: 150%;
              background: $pr1;
              width: 1px;
              right: -9px;
              top: -6px;
              pointer-events: none;
            }

            &:after{
              background: $pr1;
            }
          }
        }

        .footer-info{
          display: flex;
          flex-direction: column;
          gap: 13px;
          align-items: flex-start;

          &__item{
            font-size: 14px;
            line-height: 16px;
            color: $pr1;
          }
        }
      }
    }
  }
</style>