<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { API_FILES_URL, NO_IMG_URL } from "@/main";
import { useRouter } from "vue-router";

const router = useRouter();

const login = ref("");
const lastName = ref("");
const firstName = ref("");
const patronymic = ref("");
const email = ref("");
const job = ref("");
const rank = ref("");
const degree = ref("");
const yearsAll = ref("");
const yearsSpec = ref("");
const lessons = ref("");
const extraInf = ref("");
const profileImg = ref(null);
const imgUrl = ref(null);
const role = ref("USER");
const hasLessons = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const dateErrors = ref({
  yearsAll: "",
  yearsSpec: "",
});

const parseDate = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split(".");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  return new Date(year, month, day);
};

const isValidDateFormat = (dateString) => {
  if (!dateString) return true;
  const regex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!regex.test(dateString)) return false;

  const [day, month, year] = dateString.split(".").map(Number);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const normalizeDate = (dateString) => {
  if (!dateString) return null;
  const parsedDate = parseDate(dateString);
  if (!parsedDate) return null;
  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
  );
};

const isDateInFuture = (dateString) => {
  if (!dateString) return false;
  const selectedDate = normalizeDate(dateString);
  if (!selectedDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate > today;
};

const validateYearsAll = () => {
  if (!yearsAll.value) {
    dateErrors.value.yearsAll = "";
    return true;
  }

  if (!isValidDateFormat(yearsAll.value)) {
    dateErrors.value.yearsAll = "Неверный формат даты. Используйте ДД.ММ.ГГГГ";
    return false;
  }

  if (isDateInFuture(yearsAll.value)) {
    dateErrors.value.yearsAll = "Дата начала стажа не может быть в будущем";
    return false;
  }

  dateErrors.value.yearsAll = "";
  return true;
};

const validateYearsSpec = () => {
  if (!yearsSpec.value) {
    dateErrors.value.yearsSpec = "";
    return true;
  }

  if (!isValidDateFormat(yearsSpec.value)) {
    dateErrors.value.yearsSpec = "Неверный формат даты. Используйте ДД.ММ.ГГГГ";
    return false;
  }

  if (isDateInFuture(yearsSpec.value)) {
    dateErrors.value.yearsSpec =
      "Дата начала стажа по специальности не может быть в будущем";
    return false;
  }

  if (yearsAll.value && yearsSpec.value) {
    const allDate = normalizeDate(yearsAll.value);
    const specDate = normalizeDate(yearsSpec.value);

    if (specDate && allDate && specDate < allDate) {
      dateErrors.value.yearsSpec =
        "Стаж по специальности не может начинаться раньше общего стажа";
      return false;
    }
  }

  dateErrors.value.yearsSpec = "";
  return true;
};

const validateYearLength = (value) => {
  const yearPart = value.split(".").pop();
  return !yearPart || yearPart.length <= 4;
};

const handleDateInput = (event, field) => {
  let value = event.target.value;

  let digits = value.replace(/\D/g, "");

  if (digits.length > 8) {
    digits = digits.slice(0, 8);
  }

  if (digits.length >= 5) {
    const yearPart = digits.slice(4);
    if (yearPart.length > 4) {
      digits = digits.slice(0, 8);
    }
  }

  let formatted = "";
  if (digits.length > 0) {
    formatted = digits.slice(0, 2);
    if (digits.length >= 3) {
      formatted += "." + digits.slice(2, 4);
    }
    if (digits.length >= 5) {
      formatted += "." + digits.slice(4, 8);
    }
  }

  if (field === "yearsAll") {
    yearsAll.value = formatted;
  } else {
    yearsSpec.value = formatted;
  }
};

const isFormValid = computed(() => {
  return validateYearsAll() && validateYearsSpec();
});

const onYearsAllChange = () => {
  validateYearsAll();
  if (yearsSpec.value) {
    validateYearsSpec();
  }
};

const onYearsSpecChange = () => {
  validateYearsSpec();
};

const checkImg = () => {
  if (imgUrl.value && imgUrl.value.files[0]) {
    profileImg.value = URL.createObjectURL(imgUrl.value.files[0]);
  }
};

const createUser = async () => {
  if (!isFormValid.value) {
    errorMessage.value = "Пожалуйста, исправьте ошибки в полях стажа";
    return;
  }

  errorMessage.value = "";
  isLoading.value = true;

  try {
    let imageUrl = `${NO_IMG_URL}`;

    if (imgUrl.value?.files[0]) {
      let formData = new FormData();
      formData.append("file", imgUrl.value.files[0]);

      const urlData = await axios.post("upload-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      imageUrl = urlData.data;
    }

    const formatDateForServer = (dateString) => {
      if (!dateString) return null;
      const [day, month, year] = dateString.split(".");
      return `${year}-${month}-${day}`;
    };

    await axios.post("employees", {
      patronymic: patronymic.value,
      post: job.value,
      academicTitle: rank.value,
      academicDegree: degree.value,
      experience: formatDateForServer(yearsAll.value),
      professionalExperience: formatDateForServer(yearsSpec.value),
      login: login.value,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      imageUrl: imageUrl,
      mainRole: role.value,
      hasLessons: hasLessons.value,
    });

    router.push("/is/admin");
  } catch (error) {
    errorMessage.value = `Ошибка сервера`;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="createUser" class="user-create">
    <h1 class="user-create__title">Создание пользователя</h1>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div class="user-create__field">
      <div class="user-create__field-left">
        <div class="create-box">
          <img
            v-if="profileImg !== null"
            :src="profileImg"
            alt="Аватар пользователя"
            class="create-box__image"
          />
          <div v-else class="create-box__placeholder">Нет изображения</div>
        </div>
        <input
          @change="checkImg"
          ref="imgUrl"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          style="display: none"
          id="create_image"
        />
        <label for="create_image" class="create-box__label">Загрузить</label>
      </div>

      <div class="user-create__field-right">
        <div class="user-data">
          <div class="user-data__item">
            <p class="user-data__item-name">Роль</p>
            <select v-model="role" class="user-data__item-input" required>
              <option value="USER">Пользователь</option>
              <option value="MODERATOR">Модератор</option>
              <option value="ADMIN">Админ</option>
            </select>
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
            <p class="user-data__item-name">Стаж (общий)</p>
            <input
              :value="yearsAll"
              type="text"
              class="user-data__item-input"
              :class="{ 'error-input': dateErrors.yearsAll }"
              @input="handleDateInput($event, 'yearsAll')"
              @change="onYearsAllChange"
              placeholder="ДД.ММ.ГГГГ"
              maxlength="10"
            />
            <span v-if="dateErrors.yearsAll" class="error-text">{{
              dateErrors.yearsAll
            }}</span>
          </div>

          <div class="user-data__item">
            <p class="user-data__item-name">Стаж (по специальности)</p>
            <input
              :value="yearsSpec"
              type="text"
              class="user-data__item-input"
              :class="{ 'error-input': dateErrors.yearsSpec }"
              @input="handleDateInput($event, 'yearsSpec')"
              @change="onYearsSpecChange"
              placeholder="ДД.ММ.ГГГГ"
              maxlength="10"
            />
            <span v-if="dateErrors.yearsSpec" class="error-text">{{
              dateErrors.yearsSpec
            }}</span>
          </div>

          <div class="user-data__item">
            <p class="user-data__item-name">E-mail</p>
            <input
              v-model="email"
              type="email"
              class="user-data__item-input"
              required
            />
          </div>

          <div class="user-data__item">
            <p class="user-data__item-name">Должность</p>
            <input v-model="job" type="text" class="user-data__item-input" />
          </div>

          <div class="user-data__item">
            <p class="user-data__item-name">Ученое звание</p>
            <input v-model="rank" type="text" class="user-data__item-input" />
          </div>

          <div class="user-data__item">
            <p class="user-data__item-name">Ученая степень</p>
            <input v-model="degree" type="text" class="user-data__item-input" />
          </div>

          <div class="user-data__checkbox">
            <label>
              <input type="checkbox" v-model="hasLessons" class="my-checkbox" />
              Создать расписание
            </label>
          </div>
        </div>

        <div class="user-extension"></div>
      </div>
    </div>

    <div class="user-create__buttons">
      <button
        type="submit"
        class="user-create__buttons-item"
        :disabled="isLoading || !isFormValid"
      >
        {{ isLoading ? "Создание..." : "Создать" }}
      </button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.user-create {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__title {
    font-size: 32px;
    font-weight: bold;
    color: $pr1;
  }

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
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        &__image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        &__placeholder {
          color: $sc2;
          font-size: 16px;
          text-align: center;
        }

        &__label {
          font-size: 24px;
          line-height: 28px;
          background: $sc3;
          border-radius: 10px;
          padding: 6px 0;
          transition: 0.2s;
          text-align: center;
          cursor: pointer;
          display: block;

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
              outline: none;
            }

            &.error-input {
              border-color: #dc3545;
              background-color: #fff8f8;
            }
          }
        }

        &__checkbox {
          padding-top: 10px;

          label {
            font-size: 18px;
            cursor: pointer;
          }
        }
      }

      .user-extension {
        padding: 20px 42px 20px 0;
        min-width: 364px;
        display: flex;
        flex-direction: column;
        gap: 20px;
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
      border: none;
      cursor: pointer;
      transition: 0.2s;

      &:hover:not(:disabled) {
        background: $pr1;
        color: white;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 10px;
  padding: 12px 20px;
  margin-bottom: 20px;
  font-size: 16px;
  text-align: center;
}

.error-text {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}
</style>
