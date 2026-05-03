<template>
  <header class="header">
    <div class="header__top">
      <div class="header__top-container">
        <router-link class="logo" to="/">
          <img src="./../../assets/img/logo.jpg" alt="" class="logo__image" />
          <p class="logo__title">Кафедра информационных систем</p>
        </router-link>
        <button v-if="!isAuth" @click="dialogState = true" class="login">
          <svg
            class="login__icon"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.30769 5.69231C6.30769 4.96204 6.52424 4.24817 6.92996 3.64097C7.33567 3.03378 7.91233 2.56052 8.58702 2.28106C9.2617 2.0016 10.0041 1.92848 10.7203 2.07095C11.4366 2.21342 12.0945 2.56508 12.6109 3.08145C13.1272 3.59783 13.4789 4.25574 13.6214 4.97198C13.7638 5.68821 13.6907 6.43061 13.4112 7.10529C13.1318 7.77997 12.6585 8.35663 12.0513 8.76235C11.4441 9.16807 10.7303 9.38462 10 9.38462C9.02074 9.38462 8.08159 8.99561 7.38914 8.30316C6.6967 7.61072 6.30769 6.67157 6.30769 5.69231ZM16.1538 18H3.84615C3.35652 18 2.88695 17.8055 2.54073 17.4593C2.19451 17.1131 2 16.6435 2 16.1538C2 14.685 2.58351 13.2762 3.62218 12.2376C4.66084 11.1989 6.06957 10.6154 7.53846 10.6154H12.4615C13.9304 10.6154 15.3392 11.1989 16.3778 12.2376C17.4165 13.2762 18 14.685 18 16.1538C18 16.6435 17.8055 17.1131 17.4593 17.4593C17.1131 17.8055 16.6435 18 16.1538 18Z"
            />
          </svg>
          Вход
        </button>
        <div v-else class="header-buttons">
          <router-link
            v-if="profileRole === 'ADMIN' || profileRole === 'MODERATOR'"
            to="/admin"
            class="admin-button"
          >
            Админ. панель
          </router-link>
          <router-link :to="profileLink" class="header-buttons__profile">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.42308 7.32693C8.42308 6.02613 8.80881 4.75455 9.53149 3.67298C10.2542 2.59141 11.2813 1.74843 12.4831 1.25064C13.6849 0.75285 15.0073 0.622605 16.2831 0.876377C17.5589 1.13015 18.7308 1.75654 19.6506 2.67634C20.5704 3.59614 21.1968 4.76803 21.4506 6.04383C21.7043 7.31963 21.5741 8.64203 21.0763 9.8438C20.5785 11.0456 19.7355 12.0728 18.6539 12.7954C17.5724 13.5181 16.3008 13.9038 15 13.9038C13.2557 13.9038 11.5828 13.2109 10.3494 11.9775C9.116 10.7441 8.42308 9.07123 8.42308 7.32693ZM25.9615 29.25H4.03846C3.16631 29.25 2.32987 28.9035 1.71317 28.2868C1.09646 27.6701 0.75 26.8337 0.75 25.9615C0.75 23.3451 1.78939 20.8358 3.6395 18.9857C5.48962 17.1355 7.99892 16.0962 10.6154 16.0962H19.3846C22.0011 16.0962 24.5104 17.1355 26.3605 18.9857C28.2106 20.8358 29.25 23.3451 29.25 25.9615C29.25 26.8337 28.9035 27.6701 28.2868 28.2868C27.6701 28.9035 26.8337 29.25 25.9615 29.25Z"
              />
            </svg>
          </router-link>
          <button @click="logout" class="header-buttons__logout">
            <svg
              width="30"
              height="30"
              viewBox="0 0 32 32"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.651 16.989h17.326c0.553 0 1-0.448 1-1s-0.447-1-1-1h-17.264l3.617-3.617c0.391-0.39 0.391-1.024 0-1.414s-1.024-0.39-1.414 0l-5.907 6.062 5.907 6.063c0.196 0.195 0.451 0.293 0.707 0.293s0.511-0.098 0.707-0.293c0.391-0.39 0.391-1.023 0-1.414zM29.989 0h-17c-1.105 0-2 0.895-2 2v9h2.013v-7.78c0-0.668 0.542-1.21 1.21-1.21h14.523c0.669 0 1.21 0.542 1.21 1.21l0.032 25.572c0 0.668-0.541 1.21-1.21 1.21h-14.553c-0.668 0-1.21-0.542-1.21-1.21v-7.824l-2.013 0.003v9.030c0 1.105 0.895 2 2 2h16.999c1.105 0 2.001-0.895 2.001-2v-28c-0-1.105-0.896-2-2-2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="header__bottom">
      <nav class="nav">
        <router-link
          v-for="tab in navTabs"
          :key="tab.id"
          class="nav__item hover-underline"
          :to="tab.url"
          :title="tab.name"
        >
          {{ tab.name }}
        </router-link>
      </nav>
    </div>
    <GDialog v-model="dialogState" :max-width="500">
      <!-- Обычный логин -->
      <form
        v-if="!twoFactorRequired"
        @submit.prevent="auth"
        class="login-modal"
      >
        <img src="../../assets/img/logo.jpg" alt="" class="login-modal__logo" />
        <div class="login-modal__inputs">
          <div class="login-modal__inputs-item">
            <p class="login-modal__inputs-item_name">Логин</p>
            <input
              type="text"
              class="login-modal__inputs-item_input"
              v-model="login"
              required
            />
          </div>
          <div class="login-modal__inputs-item">
            <p class="login-modal__inputs-item_name">Пароль</p>
            <input
              type="password"
              class="login-modal__inputs-item_input"
              v-model="password"
              required
            />
          </div>
        </div>
        <p class="login-modal__error">{{ authError }}</p>
        <button type="submit" class="login-modal__submit">Вход</button>
      </form>

      <!-- Ввод кода 2FA -->
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
import { useTabsStore } from "@/store/tabsStore";
import OtpInput from "@/components/includes/OtpInput.vue";

const store = userAuth();
const tabsStore = useTabsStore();

const dialogState = ref(false);
const login = ref("");
const password = ref("");
const profileId = ref(0);
const profileRole = ref("");
const profileRouteBase = ref("/profile/");
const authError = ref("");
const twoFactorRequired = ref(false);
const twoFactorEmail = ref("");
const twoFactorLoading = ref(false);
const twoFactorCooldown = ref(60);
const loginOtpRef = ref(null);

const isAuth = computed(() => store.getIsAuth);
const navTabs = computed(() => tabsStore.visibleTabs);
const profileLink = computed(
  () => `${profileRouteBase.value}${profileId.value}`,
);
onMounted(async () => {
  console.log(store.getRole);
  if (store.getRole !== "") {
    accountInfo();
  }
  await tabsStore.loadVisibleTabs();
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
      store.setAuth(token, response.data.mainRole || response.data.role);
      location.reload();
    }
  } catch (err) {
    const isHtml =
      err.response?.data &&
      (err.response.data.includes("<!DOCTYPE") ||
        err.response.data.trim().startsWith("<"));

    if (isHtml) {
      authError.value = "Сервер временно недоступен. Попробуйте позже.";
    } else {
      authError.value = "Неверный логин или пароль";
    }
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
    store.setAuth(token, response.data.mainRole || response.data.role);
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

const getAuthenticatedAccount = async () => {
  const endpoints = ["account", "student/account"];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint);
      return {
        endpoint,
        data: Array.isArray(response.data) ? response.data[0] : response.data,
      };
    } catch (error) {
      if (endpoint === endpoints[endpoints.length - 1]) {
        throw error;
      }
    }
  }
};

const accountInfo = async () => {
  profileRole.value = store.getRole;
  try {
    const accountData = await getAuthenticatedAccount();
    profileId.value = accountData?.data?.id ?? 0;
    profileRole.value =
      accountData?.data?.mainRole || accountData?.data?.role || store.getRole;
    profileRouteBase.value =
      accountData?.endpoint === "student/account"
        ? "/student-profile/"
        : "/profile/";
  } catch (error) {
    if (error.response?.status === 500 && store.getRole !== "") {
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
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;

  &__top {
    &-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1440px;
      margin: 0 auto;
      gap: 10px;
      padding: 22px 0;

      @media (max-width: 1480px) {
        max-width: calc(100% - 40px);
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 18px;

        &__image {
          max-width: 50px;
        }

        &__title {
          font-size: 36px;
          font-weight: 700;
          line-height: 46px;
          font-family: "Lora", serif;
        }
      }

      .login {
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

        &:hover {
          background: none;
          color: $pr1;

          & svg {
            fill: $pr1;
          }
        }

        &__icon {
          width: 20px;
          height: 20px;
          fill: white;
        }
      }
    }
  }

  &__bottom {
    background: $pr1;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 56px;
    max-width: 1440px;
    margin: 0 auto;
    padding: 22px 40px;
    flex-wrap: wrap;

    &__item {
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
      color: white;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;

      &:after {
        background: $pr2;
      }

      &:hover,
      &.router-link-active,
      &.router-link-exact-active {
        color: $pr2;
      }

      &.router-link-active:after,
      &.router-link-exact-active:after {
        left: 0;
        right: 0;
      }
    }
  }
}

.login-modal {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 17px 20px;
  position: relative;

  &__logo {
    width: 95px;
    align-self: center;
  }

  &__inputs {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 15px;
    border-radius: 10px;
    background: $pr3;

    &-item {
      display: flex;
      flex-direction: column;
      gap: 10px;

      &_name {
        font-size: 24px;
        line-height: 28px;
        color: $pr1;
      }

      &_input {
        font-size: 20px;
        line-height: 24px;
        padding: 5px;
        width: 100%;
        background: $sc3;
        border: 1px solid $sc2;
        border-radius: 10px;
        transition: 0.3s;

        &:focus {
          border-color: $pr1;
        }
      }
    }
  }

  &__error {
    color: crimson;
    position: absolute;
    left: 40px;
    bottom: 60px;
  }

  &__submit {
    font-size: 24px;
    line-height: 28px;
    color: $pr1;
    background: $sc3;
    border-radius: 10px;
    padding: 5px 0;

    &:hover {
      background: $pr1;
      color: white;
    }
  }

  &__2fa-title {
    font-size: 22px;
    color: $pr1;
    text-align: center;
  }

  &__2fa-subtitle {
    font-size: 14px;
    color: $sc5;
    text-align: center;
  }

  &__back {
    font-size: 14px;
    color: $pr1;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    align-self: center;

    &:hover {
      opacity: 0.7;
    }
  }
}

.header-buttons {
  display: flex;
  align-items: center;
  gap: 10px;

  .admin-button {
    min-height: 44px;
    padding: 0 18px;
    border: 1px solid rgba($pr1, 0.18);
    border-radius: 999px;
    background: $pr1;
    box-shadow: 0 8px 18px rgba($pr1, 0.14);
    color: white;
    font-size: 16px;
    line-height: 20px;
    white-space: nowrap;

    &:hover {
      background: lighten($pr1, 7%);
      border-color: lighten($pr1, 7%);
      color: white;
      transform: translateY(-1px);
    }
  }

  &__profile,
  &__logout {
    width: 44px;
    height: 44px;
    background: $pr3;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba($pr1, 0.18);
    box-shadow: 0 8px 18px rgba($pr1, 0.1);

    & svg {
      width: 24px;
      height: 24px;
      fill: $pr1;
    }

    &:hover {
      background: $pr1;
      border-color: $pr1;
      transform: translateY(-1px);

      & svg {
        fill: white;
      }
    }
  }

  &__logout:hover {
    background: #c62828;
    border-color: #c62828;
  }
}
</style>
