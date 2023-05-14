<script setup>
import {ref} from "vue";
import axios from "axios";

const login = ref('')
const lastName = ref('')
const firstName = ref('')
const patronymic = ref('')
const email = ref('')
const job = ref('')
const rank = ref('')
const degree = ref('')
const yearsAll = ref('')
const yearsSpec = ref('')
const lessons = ref('')
const extraInf = ref('')
const profileImg = ref(null)
const imgUrl = ref(null)

const checkImg = () => {
  profileImg.value = URL.createObjectURL(imgUrl.value.files[0])
}

const createUser = async () => {
  let formData = new FormData()

  formData.append('file', imgUrl.value.files[0])

  await axios.post('uploadFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
      .then(async (urlData) => {
        await axios.post('employees', {
          patronymic: patronymic.value,
          post: job.value,
          academicTitle: rank.value,
          academicDegree: degree.value,
          experience: yearsAll.value,
          professionalExperience: yearsSpec.value,
          login: login.value,
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          imageUrl: urlData.data,
        })
      })
}
</script>

<template>
  <section class="user-create">
      <h1 class="user-create__title">Создание пользователя</h1>
      <div class="user-create__field">
          <div class="user-create__field-left">
              <div class="create-box">
                  <img v-if="profileImg !== null" :src="profileImg" alt="" class="create-box__image">
              </div>
              <input v-on:change="checkImg" ref="imgUrl" type="file" accept="image/png, image/jpeg, image/jpg" style="display: none" id="create_image">
              <label for="create_image" class="create-box__label">Загрузить</label>
          </div>
          <div class="user-create__field-right">
              <div class="user-data">
                  <div class="user-data__item">
                      <p class="user-data__item-name">Логин</p>
                      <input v-model="login" type="text" class="user-data__item-input">
                  </div>
                  <div class="user-data__item">
                      <p class="user-data__item-name">Фамилия</p>
                      <input v-model="lastName" type="text" class="user-data__item-input">
                  </div>
                  <div class="user-data__item">
                      <p class="user-data__item-name">Имя</p>
                      <input v-model="firstName" type="text" class="user-data__item-input">
                  </div>
                  <div class="user-data__item">
                      <p class="user-data__item-name">Отчество</p>
                      <input v-model="patronymic" type="text" class="user-data__item-input">
                  </div>
                  <div class="user-data__item">
                      <p class="user-data__item-name">Стаж (общий)</p>
                      <input v-model="yearsAll" type="text" class="user-data__item-input">
                  </div>
                  <div class="user-data__item">
                      <p class="user-data__item-name">Стаж (по специальности)</p>
                      <input v-model="yearsSpec" type="text" class="user-data__item-input">
                  </div>
                  <div class="user-data__item">
                      <p class="user-data__item-name">E-mail</p>
                      <input v-model="email" type="text" class="user-data__item-input">
                  </div>
                  <div class="user-data__item">
                      <p class="user-data__item-name">Должность</p>
                      <input v-model="job" type="text" class="user-data__item-input">
                  </div>
                  <div class="user-data__item">
                      <p class="user-data__item-name">Ученое звание</p>
                      <input v-model="rank" type="text" class="user-data__item-input">
                  </div>
                  <div class="user-data__item">
                      <p class="user-data__item-name">Ученая степень</p>
                      <input v-model="degree" type="text" class="user-data__item-input">
                  </div>
                  <div class="user-data__item">
                      <p class="user-data__item-name">Преподаваемые дисциплины</p>
                      <input v-model="lessons" type="text" class="user-data__item-input">
                  </div>
              </div>
              <div class="user-extension">
                <p class="user-data__item-name">Дополнительная информация</p>
                <textarea v-model="extraInf" class="user-data__item-input"></textarea>
              </div>
          </div>
      </div>
      <div class="user-create__buttons">
        <button @click="createUser" class="user-create__buttons-item">Создать</button>
      </div>
  </section>
</template>

<style lang="scss">
@import "@/assets/styles/_variables.scss";

.user-create{
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

        &-left{
            border-right: 3px solid $pr2;
            padding: 50px 40px;
            max-width: 446px;
            display: flex;
            flex-direction: column;
            gap: 30px;

            .create-box{
                border-radius: 10px;
                background: $sc3;
                width: 364px;
                height: 364px;

                &__image{
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }

                &__label{
                    font-size: 24px;
                    line-height: 28px;
                    background: $sc3;
                    border-radius: 10px;
                    padding: 6px 0;
                    transition: 0.2s;
                    text-align: center;
                    cursor: pointer;

                    &:hover{
                        background: $pr1;
                        color: white;
                    }
                }
            }
        }

        &-right{
          display: flex;
          flex-direction: row;
          gap: 10px;
          width: 100%;

          .user-data{
            padding: 20px 50px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;

            &__item{
              display: flex;
              flex-direction: column;
              gap: 5px;
              width: 100%;

              &-name{
                font-size: 24px;
                line-height: 28px;
                color: $pr1;
              }

              &-input{
                font-size: 18px;
                line-height: 21px;
                background: $sc3;
                border: 1px solid $sc2;
                border-radius: 10px;
                padding: 7px 10px;
                width: 100%;
                transition: 0.2s;

                &:focus{
                  border-color: $pr1;
                }
              }
            }
          }

          .user-extension{
            padding: 20px 42px 20px 0;
            min-width: 364px;
            display: flex;
            flex-direction: column;
            gap: 20px;

            .user-data__item-input{
              resize: none;
              height: 100%;
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