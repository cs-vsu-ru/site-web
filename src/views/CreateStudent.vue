<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const login = ref("");
const password = ref("");
const lastName = ref("");
const firstName = ref("");
const patronymic = ref("");
const email = ref("");
const startYear = ref("");
const endYear = ref("");
const course = ref("");
const group = ref("");
const supervisor = ref("");
const role = ref("STUDENT");
const userList = ref([]);

const years = Array.from({ length: 101 }, (_, index) => 2027 - index);

onMounted(() => {
  getUsers();
});

const getUsers = async () => {
  await axios.get("employees").then((userData) => {
    userList.value = userData.data
      .filter((user) => user.isActive !== false)
      .map((user) => ({
        id: user.id,
        fullName: `${user.firstName} ${user.lastName} ${user.patronymic}`,
      }));
  });
};

const createStudent = async () => {
  await axios
    .post("students", {
      firstName: firstName.value,
      lastName: lastName.value,
      patronymic: patronymic.value,
      login: login.value,
      password: password.value,
      email: email.value,
      course: Number(course.value),
      group: group.value,
      startYear: Number(startYear.value),
      endYear: Number(endYear.value),
      supervisor: supervisor.value,
    })
    .then(() => {
      window.location.replace("/is/admin");
    });
};
</script>

<template>
  <form @submit.prevent="createStudent" class="user-create">
    <h1 class="user-create__title">Создание студента</h1>
    <div class="user-create__field">
      <div class="user-create__field-right">
        <div class="user-data">
          <div class="user-data__item">
            <p class="user-data__item-name">Роль</p>
            <select v-model="role" class="user-data__item-input" required>
              <option value="STUDENT">Студент</option>
            </select>
          </div>
          <div class="user-data__item">
            <p class="user-data__item-name">E-mail</p>
            <input
              v-model="email"
              type="text"
              class="user-data__item-input"
              required
            />
          </div>
          <div class="user-data__item">
            <p class="user-data__item-name">Логин</p>
            <input
              v-model="login"
              type="text"
              class="user-data__item-input"
              required
            />
          </div>
          <div class="user-data__item">
            <p class="user-data__item-name">Пароль</p>
            <input
              v-model="password"
              type="text"
              class="user-data__item-input"
              required
            />
          </div>
          <div class="user-data__item">
            <p class="user-data__item-name">Фамилия</p>
            <input
              v-model="lastName"
              type="text"
              class="user-data__item-input"
              required
            />
          </div>
          <div class="user-data__item">
            <p class="user-data__item-name">Имя</p>
            <input
              v-model="firstName"
              type="text"
              class="user-data__item-input"
              required
            />
          </div>
          <div class="user-data__item">
            <p class="user-data__item-name">Отчество</p>
            <input
              v-model="patronymic"
              type="text"
              class="user-data__item-input"
              required
            />
          </div>
          <div class="user-data__item">
            <p class="user-data__item-name">Курс</p>
            <input
              v-model.number="course"
              type="number"
              min="1"
              class="user-data__item-input"
              required
            />
          </div>
          <div class="user-data__item">
            <p class="user-data__item-name">Группа</p>
            <input
              v-model="group"
              type="text"
              class="user-data__item-input"
              required
            />
          </div>
          <div class="user-data__item">
            <p class="user-data__item-name">Год начала обучения</p>
            <select
              v-model.number="startYear"
              class="user-data__item-input"
              required
            >
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="user-data__item">
            <p class="user-data__item-name">Год окончания обучения</p>
            <select
              v-model.number="endYear"
              class="user-data__item-input"
              required
            >
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div class="user-data__item">
            <p class="user-data__item-name">Научный руководитель</p>
            <select
              v-model.number="supervisor"
              class="user-data__item-input"
              required
            >
              <option v-for="user in userList" :key="user.id" :value="user.id">
                {{ user.fullName }}
              </option>
            </select>
          </div>
        </div>
        <div class="user-extension"></div>
      </div>
    </div>
    <div class="user-create__buttons">
      <button type="submit" class="user-create__buttons-item">Создать</button>
    </div>
  </form>
</template>

<style lang="scss">
@import "@/assets/styles/_variables.scss";

.user-create {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__field {
    background: $pr3;
    border-radius: 10px;
    display: flex;
    align-items: stretch;

    &-left {
      border-right: 3px solid $pr2;
      padding: 50px 40px;
      max-width: 446px;
      display: flex;
      flex-direction: column;
      gap: 30px;

      .create-box {
        border-radius: 10px;
        background: $sc3;
        width: 364px;
        height: 364px;

        &__label {
          font-size: 24px;
          line-height: 28px;
          background: $sc3;
          border-radius: 10px;
          padding: 6px 0;
          transition: 0.2s;
          text-align: center;
          cursor: pointer;

          &:hover {
            background: $pr1;
            color: white;
          }
        }
      }
    }

    &-right {
      display: flex;
      flex-direction: row;
      gap: 10px;
      width: 100%;

      .user-data {
        padding: 20px 50px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;

        &__item {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 100%;

          &-name {
            font-size: 24px;
            line-height: 28px;
            color: $pr1;
          }

          &-input {
            font-size: 18px;
            line-height: 21px;
            background: $sc3;
            border: 1px solid $sc2;
            border-radius: 10px;
            padding: 7px 10px;
            width: 100%;
            transition: 0.2s;

            &:focus {
              border-color: $pr1;
            }
          }
        }

        &__checkbox {
          padding-top: 10px;
        }
      }

      .user-extension {
        padding: 20px 42px 20px 0;
        min-width: 364px;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .user-data__item-input {
          resize: none;
          height: 100%;
        }
      }
    }
  }

  &__buttons {
    background: $pr3;
    border-radius: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 25px 0;

    &-item {
      font-size: 24px;
      color: $pr1;
      background: $sc3;
      width: 265px;
      padding: 6px 0;
      border-radius: 10px;

      &:hover {
        background: $pr1;
        color: white;
      }
    }
  }
}
</style>
