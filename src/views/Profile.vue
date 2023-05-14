<template>
  <section class="profile" v-if="destination">
      <div class="profile__left">
          <div class="profile__left-block">
              <img :src="destination.imageUrl" alt="" class="profile__left-block_image">
          </div>
          <div class="profile__left-buttons">
            <router-link :to="'/schedule/' + destination.id" class="profile__left-buttons_item">Расписание преподавателя</router-link>
            <button class="profile__left-buttons_item">Научное руководство</button>
          </div>
      </div>
      <div class="profile__right">
          <p class="profile__right-name">{{ destination.lastName + ' ' + destination.firstName + ' ' + destination.patronymic }}</p>
          <p class="profile__right-item">Должность <span>{{ destination.post }}</span></p>
          <p class="profile__right-item">Ученое звание / Ученая степень <span>{{ destination.academicTitle }} / {{ destination.academicDegree }}</span></p>
          <p class="profile__right-item">Стаж <span>Общий - {{ destination.experience }} / По специальности - {{ destination.professionalExperience }}</span></p>
          <p class="profile__right-item">Преподаваемые дисциплины
              <span v-for="lesson in destination.teachings">{{ lesson.subject.name }}</span>
          </p>
      </div>
      <button v-if="userRole === 'ROLE_ADMIN'" class="admin-button profile__edit">Редактировать</button>
  </section>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

const accountInfo = ref([])
const userRole = ref()
const route = useRoute()

const destinationId = computed(() => route.params.id)
const destination = computed(() => {
    return accountInfo.value.find(item => item.id == destinationId.value)
})

onMounted(() => {
    accountAPI()
    checkRole()
})

const accountAPI = async () => {
    await axios.get('employees')
        .then((accId) => {
            console.log(accId)
            accountInfo.value = accId.data
        })
}

const checkRole = async () => {
  await axios.get('account')
      .then((items) => {
        userRole.value = items.data.mainRole
      })
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.profile{
  max-width: 1440px;
  margin: 0 auto 40px;
  background: $pr3;
  border-radius: 25px;
  padding: 15px;
  display: flex;
  align-items: stretch;
  gap: 60px;
  position: relative;

  &__left{
    background: #C2EEFF;
    padding: 20px;
    max-width: 385px;
    width: 100%;
    border-radius: 25px;

    &-block{
      width: 345px;
      height: 345px;
      background: $sc3;
      border-radius: 15px;

      &_image{
        width: 345px;
        height: 345px;
        object-fit: contain;
      }
    }

    &-buttons{
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 30px;

      &_item{
        font-size: 18px;
        line-height: 21px;
        background: $sc3;
        border-radius: 10px;
        padding: 10px 0;
        text-align: center;

        &:hover{
          color: white;
          background: $pr1;
        }
      }
    }
  }

  &__right{
    background: #C2EEFF;
    width: 100%;
    border-radius: 25px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    &-name{
      font-size: 40px;
      line-height: 47px;
      color: $pr1;
    }

    &-item{
      font-size: 24px;
      line-height: 28px;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
      flex-wrap: wrap;
      color: $pr1;

      & span{
        font-size: 18px;
        line-height: 22px;
      }
    }
  }

  &__edit{
    position: absolute;
    right: 30px;
    top: 30px;
    background: white;

    &:hover{
      background: $pr1;
    }
  }
}
</style>