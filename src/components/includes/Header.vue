<template>
  <header class="header">
    <div class="header__top">
      <div class="header__top-container">
        <router-link class="logo" to="/">
          <img src="./../../assets/img/logo.png" alt="" class="logo__image">
          <p class="logo__title">Кафедра Информационных систем</p>
        </router-link>
        <button class="login">
          <svg class="login__icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.30769 5.69231C6.30769 4.96204 6.52424 4.24817 6.92996 3.64097C7.33567 3.03378 7.91233 2.56052 8.58702 2.28106C9.2617 2.0016 10.0041 1.92848 10.7203 2.07095C11.4366 2.21342 12.0945 2.56508 12.6109 3.08145C13.1272 3.59783 13.4789 4.25574 13.6214 4.97198C13.7638 5.68821 13.6907 6.43061 13.4112 7.10529C13.1318 7.77997 12.6585 8.35663 12.0513 8.76235C11.4441 9.16807 10.7303 9.38462 10 9.38462C9.02074 9.38462 8.08159 8.99561 7.38914 8.30316C6.6967 7.61072 6.30769 6.67157 6.30769 5.69231ZM16.1538 18H3.84615C3.35652 18 2.88695 17.8055 2.54073 17.4593C2.19451 17.1131 2 16.6435 2 16.1538C2 14.685 2.58351 13.2762 3.62218 12.2376C4.66084 11.1989 6.06957 10.6154 7.53846 10.6154H12.4615C13.9304 10.6154 15.3392 11.1989 16.3778 12.2376C17.4165 13.2762 18 14.685 18 16.1538C18 16.6435 17.8055 17.1131 17.4593 17.4593C17.1131 17.8055 16.6435 18 16.1538 18Z"/>
          </svg>
          Вход
        </button>
      </div>
    </div>
    <div class="header__bottom">
      <nav class="nav">
        <router-link class="nav__item hover-underline" to="/">О кафедре</router-link>
        <router-link class="nav__item hover-underline" to="/">Образование</router-link>
        <router-link class="nav__item hover-underline" to="/">Расписание</router-link>
        <router-link class="nav__item hover-underline" to="/">Студентам и выпускникам</router-link>
        <router-link class="nav__item hover-underline" to="/">Сотрудникам</router-link>
        <router-link class="nav__item hover-underline" to="/">Партнеры</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>

</script>

<style lang="scss" scoped>
  @import "@/assets/styles/_variables.scss";

  .header{
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;

    &__top{
      border-bottom: 2px solid $pr2;

      &-container{
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1440px;
        margin: 0 auto;
        gap: 10px;
        padding: 22px 0;

        .logo{
          display: flex;
          align-items: center;
          gap: 18px;

          &__image{
            width: 105px;
            height: 52px;
          }

          &__title{
            font-size: 36px;
            font-weight: 700;
            line-height: 46px;
            font-family: 'Lora', serif;
          }
        }

        .login{
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 10px;
          background: $pr1;
          font-size: 14px;
          line-height: 16px;
          color: white;
          outline: 1px solid $pr1;

          &:hover{
            background: none;
            color: $pr1;

            & svg{
              fill: $pr1;
            }
          }

          &__icon{
            width: 20px;
            height: 20px;
            fill: white;
          }
        }
      }
    }

    .nav{
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 10px;
      max-width: 1440px;
      margin: 23px auto;

      &__item{
        font-size: 18px;
        line-height: 21px;
        color: $pr1;

        &:after{
          background: $pr1;
        }
      }
    }
  }
</style>