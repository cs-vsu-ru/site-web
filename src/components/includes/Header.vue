<template>
  <header class="header">
    <div class="header__top">
      <div class="header__top-container">
        <router-link class="logo" to="/">
          <img src="./../../assets/img/logo.jpg" alt="" class="logo__image" />
          <p class="logo__title">Кафедра информационных систем</p>
        </router-link>

        <div class="header__actions">
          <button
            v-if="!isAuth"
            @click="dialogState = true"
            class="header__action-btn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.42308 7.32693C8.42308 6.02613 8.80881 4.75455 9.53149 3.67298C10.2542 2.59141 11.2813 1.74843 12.4831 1.25064C13.6849 0.75285 15.0073 0.622605 16.2831 0.876377C17.5589 1.13015 18.7308 1.75654 19.6506 2.67634C20.5704 3.59614 21.1968 4.76803 21.4506 6.04383C21.7043 7.31963 21.5741 8.64203 21.0763 9.8438C20.5785 11.0456 19.7355 12.0728 18.6539 12.7954C17.5724 13.5181 16.3008 13.9038 15 13.9038C13.2557 13.9038 11.5828 13.2109 10.3494 11.9775C9.116 10.7441 8.42308 9.07123 8.42308 7.32693ZM25.9615 29.25H4.03846C3.16631 29.25 2.32987 28.9035 1.71317 28.2868C1.09646 27.6701 0.75 26.8337 0.75 25.9615C0.75 23.3451 1.78939 20.8358 3.6395 18.9857C5.48962 17.1355 7.99892 16.0962 10.6154 16.0962H19.3846C22.0011 16.0962 24.5104 17.1355 26.3605 18.9857C28.2106 20.8358 29.25 23.3451 29.25 25.9615C29.25 26.8337 28.9035 27.6701 28.2868 28.2868C27.6701 28.9035 26.8337 29.25 25.9615 29.25Z"
              />
            </svg>
            <span>Вход</span>
          </button>

          <div v-else class="header__user-menu">
            <router-link
              v-if="profileRole === 'ADMIN' || profileRole === 'MODERATOR'"
              to="/admin"
              class="header__action-btn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path
                  d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.33-.02-.64-.06-.94l2.02-1.58c.18-.14.23-.38.12-.56l-1.89-3.28c-.12-.19-.36-.26-.56-.18l-2.38.96c-.5-.38-1.06-.68-1.66-.88L14.45 3.5c-.04-.2-.2-.34-.4-.34h-3.78c-.2 0-.36.14-.4.34l-.3 2.52c-.6.2-1.16.5-1.66.88l-2.38-.96c-.2-.08-.44-.01-.56.18l-1.89 3.28c-.12.19-.07.42.12.56l2.02 1.58c-.04.3-.06.61-.06.94 0 .33.02.64.06.94l-2.02 1.58c-.18.14-.23.38-.12.56l1.89 3.28c.12.19.36.26.56.18l2.38-.96c.5.38 1.06.68 1.66.88l.3 2.52c.04.2.2.34.4.34h3.78c.2 0 .36-.14.4-.34l.3-2.52c.6-.2 1.16-.5 1.66-.88l2.38.96c.2.08.44.01.56-.18l1.89-3.28c.12-.19.07-.42-.12-.56l-2.02-1.58zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                />
              </svg>
              <span>Админ. панель</span>
            </router-link>

            <router-link
              :to="'/profile/' + profileId"
              class="header__action-btn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path
                  d="M8.42308 7.32693C8.42308 6.02613 8.80881 4.75455 9.53149 3.67298C10.2542 2.59141 11.2813 1.74843 12.4831 1.25064C13.6849 0.75285 15.0073 0.622605 16.2831 0.876377C17.5589 1.13015 18.7308 1.75654 19.6506 2.67634C20.5704 3.59614 21.1968 4.76803 21.4506 6.04383C21.7043 7.31963 21.5741 8.64203 21.0763 9.8438C20.5785 11.0456 19.7355 12.0728 18.6539 12.7954C17.5724 13.5181 16.3008 13.9038 15 13.9038C13.2557 13.9038 11.5828 13.2109 10.3494 11.9775C9.116 10.7441 8.42308 9.07123 8.42308 7.32693ZM25.9615 29.25H4.03846C3.16631 29.25 2.32987 28.9035 1.71317 28.2868C1.09646 27.6701 0.75 26.8337 0.75 25.9615C0.75 23.3451 1.78939 20.8358 3.6395 18.9857C5.48962 17.1355 7.99892 16.0962 10.6154 16.0962H19.3846C22.0011 16.0962 24.5104 17.1355 26.3605 18.9857C28.2106 20.8358 29.25 23.3451 29.25 25.9615C29.25 26.8337 28.9035 27.6701 28.2868 28.2868C27.6701 28.9035 26.8337 29.25 25.9615 29.25Z"
                />
              </svg>
              <span>Профиль</span>
            </router-link>

            <button @click="logout" class="header__action-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path
                  d="M3.651 16.989h17.326c0.553 0 1-0.448 1-1s-0.447-1-1-1h-17.264l3.617-3.617c0.391-0.39 0.391-1.024 0-1.414s-1.024-0.39-1.414 0l-5.907 6.062 5.907 6.063c0.196 0.195 0.451 0.293 0.707 0.293s0.511-0.098 0.707-0.293c0.391-0.39 0.391-1.023 0-1.414zM29.989 0h-17c-1.105 0-2 0.895-2 2v9h2.013v-7.78c0-0.668 0.542-1.21 1.21-1.21h14.523c0.669 0 1.21 0.542 1.21 1.21l0.032 25.572c0 0.668-0.541 1.21-1.21 1.21h-14.553c-0.668 0-1.21-0.542-1.21-1.21v-7.824l-2.013 0.003v9.030c0 1.105 0.895 2 2 2h16.999c1.105 0 2.001-0.895 2.001-2v-28c-0-1.105-0.896-2-2-2z"
                />
              </svg>
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="header__bottom">
      <nav class="nav">
        <router-link class="nav__item" to="/about">О кафедре</router-link>
        <router-link class="nav__item" to="/education">Образование</router-link>
        <router-link class="nav__item" to="/full-schedule"
          >Расписание</router-link
        >
        <router-link class="nav__item" to="/exams">Учебный процесс</router-link>
        <router-link class="nav__item" to="/students">Студентам</router-link>
        <router-link class="nav__item" to="/teachers">Сотрудники</router-link>
        <router-link class="nav__item" to="/important">Важное</router-link>
        <router-link class="nav__item" to="/miscellaneous">Разное</router-link>
      </nav>
    </div>

    <GDialog v-model="dialogState" :max-width="500">
      <form
        v-if="!twoFactorRequired"
        @submit.prevent="auth"
        class="login-modal"
      >
        <img src="../../assets/img/logo.jpg" alt="" class="login-modal__logo" />
        <div class="login-modal__inputs">
          <div class="login-modal__inputs-item">
            <label class="login-modal__inputs-item_name">Логин</label>
            <input
              type="text"
              class="login-modal__inputs-item_input"
              v-model="login"
              required
            />
          </div>
          <div class="login-modal__inputs-item">
            <label class="login-modal__inputs-item_name">Пароль</label>
            <input
              type="password"
              class="login-modal__inputs-item_input"
              v-model="password"
              required
            />
          </div>
        </div>
        <p v-if="authError" class="login-modal__error">{{ authError }}</p>
        <button type="submit" class="login-modal__submit">Вход</button>
      </form>

      <div v-else class="login-modal">
        <img src="../../assets/img/logo.jpg" alt="" class="login-modal__logo" />
        <h3 class="login-modal__2fa-title">Двухфакторная аутентификация</h3>
        <p class="login-modal__2fa-subtitle">
          Введите код, отправленный на {{ twoFactorEmail }}
        </p>
        <OtpInput
          ref="loginOtpRef"
          :error="authError"
          :loading="twoFactorLoading"
          :cooldown="twoFactorCooldown"
          @complete="verify2fa"
          @resend="resend2fa"
        />
        <button class="login-modal__back" @click="backToLogin">Назад</button>
      </div>
    </GDialog>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { GDialog } from "gitart-vue-dialog";
import axios from "axios";
import { userAuth } from "@/store/userAuth";
import OtpInput from "@/components/includes/OtpInput.vue";

const store = userAuth();

const dialogState = ref(false);
const login = ref("");
const password = ref("");
const profileId = ref(0);
const profileRole = ref("");
const authError = ref("");
const twoFactorRequired = ref(false);
const twoFactorEmail = ref("");
const twoFactorLoading = ref(false);
const twoFactorCooldown = ref(60);
const loginOtpRef = ref(null);

const isAuth = computed(() => store.getIsAuth);

onMounted(() => {
  if (store.getRole !== "") {
    accountInfo();
  }
});

const auth = async () => {
  authError.value = "";
  try {
    const response = await axios.post("authenticate", {
      username: login.value,
      password: password.value,
      rememberMe: true,
    });
    if (response.data.requiresTwoFactor) {
      twoFactorRequired.value = true;
      twoFactorEmail.value = response.data.email;
      twoFactorCooldown.value = 60;
    } else {
      const token = response.data.accessToken || response.data.jwtToken;
      store.setAuth(token, response.data.mainRole);
      location.reload();
    }
  } catch (err) {
    authError.value =
      err.response?.data?.detail ||
      err.response?.data ||
      "Неверный логин или пароль";
  }
};

const verify2fa = async (code) => {
  authError.value = "";
  twoFactorLoading.value = true;
  try {
    const response = await axios.post("verify-2fa", {
      email: twoFactorEmail.value,
      code,
    });
    const token = response.data.accessToken || response.data.jwtToken;
    store.setAuth(token, response.data.mainRole);
    location.reload();
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data;
    if (status === 429) {
      const match = typeof message === "string" && message.match(/(\d+)/);
      if (match && loginOtpRef.value) {
        loginOtpRef.value.startCooldown(parseInt(match[1]));
      }
      authError.value = message || "Превышен лимит попыток. Попробуйте позже.";
    } else if (status === 410) {
      authError.value = "Код истёк. Запросите новый код.";
    } else if (status === 404) {
      authError.value = "Код не найден. Запросите новый код.";
    } else {
      authError.value =
        typeof message === "string" ? message : "Неверный код подтверждения";
    }
    if (loginOtpRef.value) loginOtpRef.value.reset();
  } finally {
    twoFactorLoading.value = false;
  }
};

const resend2fa = async () => {
  authError.value = "";
  try {
    await axios.post("2fa/resend", { email: twoFactorEmail.value });
    twoFactorCooldown.value = 60;
    if (loginOtpRef.value) loginOtpRef.value.startCooldown(60);
  } catch (err) {
    const message = err.response?.data;
    if (err.response?.status === 429) {
      const match = typeof message === "string" && message.match(/(\d+)/);
      if (match && loginOtpRef.value) {
        loginOtpRef.value.startCooldown(parseInt(match[1]));
      }
      authError.value = message || "Повторная отправка пока недоступна";
    }
  }
};

const backToLogin = () => {
  twoFactorRequired.value = false;
  twoFactorEmail.value = "";
  authError.value = "";
};

const logout = () => {
  store.setAuth("", "");
  location.reload();
};

const accountInfo = async () => {
  profileRole.value = store.getRole;
  try {
    await axios.get("account").then((profId) => {
      profileId.value = profId.data.id;
    });
  } catch (error) {
    if (error.response.status === 500 && store.getRole !== "") {
      console.error("A 500 error occurred:", error.message);
      logout();
    } else {
      console.error("An unexpected error occurred:", error.message);
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/styles/_variables.scss";

.header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &__top {
    border-bottom: 1px solid rgba($pr2, 0.3);

    &-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1440px;
      margin: 0 auto;
      padding: 20px 0;

      @media (max-width: 1480px) {
        max-width: calc(100% - 40px);
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 15px;
        text-decoration: none;
        transition: opacity 0.3s ease;

        &:hover {
          opacity: 0.8;
        }

        &__image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 12px;
        }

        &__title {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.3;
          font-family: "Lora", serif;
          color: $pr1;
          margin: 0;

          @media (max-width: 768px) {
            font-size: 20px;
          }
        }
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
  }

  &__action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 16px;
    background: $sc3;
    border-radius: 10px;
    color: $pr1;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    box-sizing: border-box;
    line-height: 1;

    svg {
      width: 20px;
      height: 20px;
      color: $pr1;
      transition: all 0.3s ease;
    }

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__user-menu {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__bottom {
    background: linear-gradient(135deg, $pr1 0%, darken($pr1, 5%) 100%);

    .nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 40px;
      max-width: 1440px;
      margin: 0 auto;
      padding: 12px 20px;

      @media (max-width: 1200px) {
        flex-wrap: wrap;
        gap: 16px;
      }

      @media (max-width: 768px) {
        gap: 12px;
      }

      &__item {
        padding: 8px 16px;
        font-size: 15px;
        font-weight: 500;
        line-height: 1.2;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        position: relative;

        &:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
      }
    }
  }
}

.login-modal {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 30px;

  &__logo {
    width: 80px;
    align-self: center;
    border-radius: 12px;
  }

  &__inputs {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &-item {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &_name {
        font-size: 14px;
        font-weight: 600;
        line-height: 1;
        color: $pr1;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      &_input {
        font-size: 16px;
        line-height: 1;
        padding: 12px;
        width: 100%;
        background: $sc3;
        border: 2px solid rgba($pr1, 0.2);
        border-radius: 12px;
        transition: all 0.3s ease;

        &:focus {
          border-color: $pr1;
          outline: none;
          box-shadow: 0 0 0 3px rgba($pr1, 0.1);
        }
      }
    }
  }

  &__error {
    color: #dc3545;
    font-size: 14px;
    text-align: center;
    margin: -10px 0 0;
  }

  &__submit {
    font-size: 16px;
    font-weight: 600;
    line-height: 1;
    color: white;
    background: $pr1;
    border-radius: 12px;
    padding: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: darken($pr1, 10%);
      transform: translateY(-2px);
    }
  }

  &__2fa-title {
    font-size: 20px;
    font-weight: 600;
    color: $pr1;
    text-align: center;
    margin: 0;
  }

  &__2fa-subtitle {
    font-size: 14px;
    color: $sc5;
    text-align: center;
    margin: -10px 0 0;
  }

  &__back {
    font-size: 14px;
    color: $pr1;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    align-self: center;
    padding: 8px;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.7;
    }
  }
}

@media (max-width: 768px) {
  .header__action-btn {
    padding: 6px 12px;

    span {
      display: none;
    }
    &:link,
    &:visited,
    &:active {
      color: $pr1;
    }
    svg {
      margin: 0;
    }
  }

  .nav__item {
    font-size: 13px;
    padding: 6px 12px;
  }
}
</style>
