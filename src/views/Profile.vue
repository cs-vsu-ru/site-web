<template>
  <section class="profile" v-if="destination">
      <div class="profile__left">
          <div class="profile__left-block">
              <img v-if="profileImg !== null" :src="profileImg" alt="" class="profile__left-block_image">
              <img v-else :src="destination.imageUrl" alt="" class="profile__left-block_image">
          </div>
          <div class="profile__left-buttons">
            <input v-on:change="checkImg" ref="imgUrl" type="file" accept="image/png, image/jpeg, image/jpg" style="display: none" id="edit_profile_image">
            <label for="edit_profile_image" v-if="activeEdit" class="profile__left-buttons_item">Изменить фото</label>
            <router-link v-else :to="'/schedule/' + destination.id" class="profile__left-buttons_item">Расписание преподавателя</router-link>
<!--            <button class="profile__left-buttons_item">Научное руководство</button>-->
            <a v-if="!activeEdit" class="profile__left-buttons_email" :href="'mailto: ' + destination.email">{{ destination.email }}</a>
            <input class="profile__left-buttons_email" v-else v-model="destination.email" type="text">
            <input class="profile__left-buttons_email" v-if="activeEdit && login" v-model="login.login" type="text">
          </div>
      </div>
      <div v-if="!activeEdit" class="profile__right">
          <p class="profile__right-name">{{ destination.lastName + ' ' + destination.firstName + ' ' + destination.patronymic }}</p>
          <p v-if="destination.post" class="profile__right-item">Должность <span>{{ destination.post }}</span></p>
          <p v-if="destination.academicTitle && destination.academicDegree" class="profile__right-item">Ученое звание / Ученая степень <span>{{ destination.academicTitle }} / {{ destination.academicDegree }}</span></p>
          <p v-if="destination.experience && destination.professionalExperience" class="profile__right-item">Стаж <span>Общий - {{ Math.floor((new Date() - new Date(destination.experience)) / 1000 / 24 / 60 / 60 / 365) }} / По специальности - {{ Math.floor((new Date() - new Date(destination.professionalExperience)) / 1000 / 24 / 60 / 60 / 365) }}</span></p>
          <div v-if="currUserId === destination.id && destination.id !== 1 && userRole !== 'ROLE_ADMIN' && destination.plan !== null" style="align-self:flex-start;" class="profile__right-plan">
            <p class="profile__right-item">Индивидуальный план</p>
            <a style="margin-top: 15px;" class="admin-button" :href="destination.plan">Скачать</a>
          </div>
        <div v-if="userRole === 'ROLE_ADMIN' && destination.id !== 1" style="align-self:flex-start;" class="profile__right-plan">
          <p class="profile__right-item">Индивидуальный план</p>
          <a v-if="destination.plan !== null" style="margin-top: 15px;" class="admin-button" :href="destination.plan">Скачать текущий план</a>
          <input ref="planUrl" style="margin-top: 10px;" type="file">
          <button @click="loadPlan" style="margin-top: 15px;" class="admin-button">Загрузить</button>
        </div>
      </div>
      <div v-else class="profile__right">
        <select class="profile__right-item" v-model="login.mainRole">
          <option value="ROLE_EMPLOYEE">Пользователь</option>
          <option value="ROLE_MODERATOR">Модератор</option>
          <option value="ROLE_ADMIN">Администратор</option>
        </select>
        <input class="profile__right-item" v-model="destination.lastName">
        <input class="profile__right-item" v-model="destination.firstName">
        <input class="profile__right-item" v-model="destination.patronymic">
        <p class="profile__right-item">Должность <input class="profile__right-item" v-model="destination.post"></p>
        <p class="profile__right-item">Ученое звание / Ученая степень <span><input class="profile__right-item" v-model="destination.academicTitle"> / <input class="profile__right-item" v-model="destination.academicDegree"></span></p>
        <p class="profile__right-item">Стаж <span>Общий - <input type="date" class="profile__right-item" v-model="destination.experience"> / По специальности - <input type="date" class="profile__right-item" v-model="destination.professionalExperience"></span></p>
      </div>
      <button v-if="userRole === 'ROLE_ADMIN' && !activeEdit" @click="activeEdit = true; getLogin(destination.id)" class="admin-button profile__edit">Редактировать</button>
      <button v-if="userRole === 'ROLE_ADMIN' && activeEdit" @click="saveProfile" class="admin-button profile__edit">Сохранить</button>
  </section>
  <Loader v-if="isLoading" />
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import Loader from "@/components/includes/Loader";

const accountInfo = ref([])
const userRole = ref()
const currUserId = ref()
const planUrl = ref(null)
const activeEdit = ref(false)
const login = ref()
const isLoading = ref(false)
const route = useRoute()
const imgUrl = ref()
const profileImg = ref(null)

const destinationId = computed(() => route.params.id)
const destination = computed(() => {
    return accountInfo.value.find(item => item.id == destinationId.value)
})

onMounted(() => {
    accountAPI()
    checkRole()
})

const checkImg = () => {
  profileImg.value = URL.createObjectURL(imgUrl.value.files[0])
}

const accountAPI = async () => {
    isLoading.value = true

    await axios.get('employees')
        .then((accId) => {
            console.log(accId)
            accountInfo.value = accId.data
            isLoading.value = false
        })
}

const checkRole = async () => {
  await axios.get('account')
      .then((items) => {
        userRole.value = items.data.mainRole
        currUserId.value = items.data.id
      })
}

const getLogin = async (currId) => {
  await axios.get('admin-employees/' + currId)
      .then((loginData) => {
        login.value = loginData.data
      })
}

const saveProfile = async () => {
  if (destination.value) {
    if (imgUrl.value.files[0]) {
      let formData = new FormData()

      formData.append('file', imgUrl.value.files[0])

      await axios.post('uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(async (urlData) => {
            await axios.patch('employees/' + destination.value.id, {
              id: destination.value.id,
              academicDegree: destination.value.academicDegree,
              academicTitle: destination.value.academicTitle,
              email: destination.value.email,
              experience: destination.value.experience,
              firstName: destination.value.firstName,
              imageUrl: urlData.data,
              lastName: destination.value.lastName,
              mainRole: login.value.mainRole,
              patronymic: destination.value.patronymic,
              post: destination.value.post,
              professionalExperience: destination.value.professionalExperience,
              login: login.value.login
            })
          })
          .then(() => {
            location.reload()
          })
    }
    else {
      await axios.patch('employees/' + destination.value.id, {
        id: destination.value.id,
        academicDegree: destination.value.academicDegree,
        academicTitle: destination.value.academicTitle,
        email: destination.value.email,
        experience: destination.value.experience,
        firstName: destination.value.firstName,
        imageUrl: destination.value.imageUrl,
        lastName: destination.value.lastName,
        mainRole: login.value.mainRole,
        patronymic: destination.value.patronymic,
        post: destination.value.post,
        professionalExperience: destination.value.professionalExperience,
        login: login.value.login
      })
          .then(() => {
            location.reload()
          })
    }
  }
}

const loadPlan = async () => {
  if (destination.value) {
    let formData = new FormData()

    formData.append('file', planUrl.value.files[0])

    await axios.post('uploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(async (urlData) => {
          await axios.patch('employees/' + destination.value.id, {
            id: destination.value.id,
            plan: urlData.data
          })

          location.reload()
        })
  }
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

  @media (max-width: 1480px) {
    max-width: calc(100% - 40px);
  }

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

      &_email{
        font-size: 22px;
        line-height: 24px;
        text-align: center;
        color: $pr1;
        font-weight: 600;
        margin-top: 10px;
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

input.profile__right-name{
  background: white;
  width: 80%;
  border-radius: 10px;
  padding: 5px;
  border: 1px solid $pr1;
}

input.profile__right-item, input.profile__left-buttons_email, select.profile__right-item{
  background: white;
  width: 80%;
  border-radius: 10px;
  padding: 5px;
  border: 1px solid $pr1;
  font-size: 18px;
  line-height: 22px;
}
</style>