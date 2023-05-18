<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const teacherList = ref()
const teacherCheck = ref([])
const mailTheme = ref()
const mailContent = ref()
const mailDate = ref()

onMounted(() => {
  getTeachers()
})

const getTeachers = async () => {
  await axios.get('employees')
      .then((teacherData) => {
        teacherList.value = teacherData.data
      })
}

const createMail = async () => {
  let newArr = []

  teacherCheck.value.forEach(el => {
    newArr.push({
      email: el
    })
  })

  await axios.post('newsletter', {
    newsletterDate: mailDate.value,
    subject: mailTheme.value,
    content: mailContent.value,
    status: 'open',
    emails: newArr
  })
      .then(() => {
        location.reload()
      })
}
</script>

<template>
  <section class="create-mail">
    <h1>Создать рассылку</h1>
    <div class="create-mail__field">
      <div class="recipients">
        <p class="recipients__title">Получатели</p>
        <div class="recipients__list">
          <label :for="teacher.id" class="recipient" v-for="teacher in teacherList">
            <p class="recipient__name">
              {{ teacher.lastName }} {{ teacher.firstName[0] }}.{{ teacher.patronymic[0] }}.
            </p>
            <input v-model="teacherCheck" :value="teacher.email" :id="teacher.id" type="checkbox">
          </label>
        </div>
      </div>
      <div class="body">
        <div class="body__item">
          <p class="body__item-name">Тема</p>
          <textarea v-model="mailTheme" class="body__item-area"></textarea>
        </div>
        <div style="align-self:flex-start;" class="body__item">
          <p class="body__item-name">Дата проведения</p>
          <input v-model="mailDate" class="body__item-date" type="datetime-local">
        </div>
        <div class="body__item">
          <p class="body__item-name">Описание</p>
          <textarea v-model="mailContent" class="body__item-area desc"></textarea>
        </div>
      </div>
    </div>
    <div class="create-mail__buttons">
      <button @click="createMail" class="create-mail__buttons-item">Создать</button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.create-mail{
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__field{
    background: $pr3;
    border-radius: 10px;
    display: flex;
    align-items: stretch;

    .recipients{
      border-right: 3px solid $pr2;
      padding: 30px 42px;
      display: flex;
      flex-direction: column;
      gap: 34px;

      &__title{
        font-size: 30px;
        line-height: 35px;
        letter-spacing: 0.015em;
        color: $pr1;
      }

      &__list{
        width: 287px;
        background: $sc3;
        border-radius: 10px;
        padding: 9px 15px;
        display: flex;
        flex-direction: column;
        gap: 5px;

        .recipient{
          padding: 5px 0;
          border-bottom: 1px solid $sc2;
          display: flex;
          align-items: center;
          justify-content: space-between;

          &__name{
            font-size: 18px;
            line-height: 21px;
            letter-spacing: 0.015em;
            color: $sc1;
          }
        }
      }
    }

    .body{
      padding: 30px 42px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 30px;

      &__item{
        display: flex;
        flex-direction: column;
        gap: 20px;

        &-name{
          font-size: 30px;
          line-height: 35px;
          color: $pr1;
        }

        &-area{
          resize: none;
          background: $sc3;
          border-radius: 10px;
          height: 68px;
          padding: 7px 10px;
          font-size: 18px;
          line-height: 21px;

          &.desc{
            height: 170px;
          }
        }

        &-date{
          font-size: 20px;
        }
      }
    }
  }

  &__buttons{
    background: $pr3;
    border-radius: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 25px 0;

    &-item{
      font-size: 24px;
      color: $pr1;
      background: $sc3;
      width: 265px;
      padding: 6px 0;
      border-radius: 10px;

      &:hover{
        background: $pr1;
        color: white;
      }
    }
  }
}
</style>