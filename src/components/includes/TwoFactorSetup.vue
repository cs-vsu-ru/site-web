<template>
  <GDialog v-model="dialogVisible" :max-width="500">
    <div class="tfa-modal">
      <!-- Шаг 1: Выбор email (только для включения) -->
      <template v-if="step === 'choose-email'">
        <h3 class="tfa-modal__title">Подключить двухфакторную аутентификацию</h3>
        <p class="tfa-modal__subtitle">Выберите email для получения кодов подтверждения</p>

        <div class="tfa-modal__options">
          <label class="tfa-modal__option">
            <input type="radio" v-model="emailOption" value="current" name="emailOption"/>
            <span>Использовать текущий email: <strong>{{ maskedCurrentEmail }}</strong></span>
          </label>
          <label class="tfa-modal__option">
            <input type="radio" v-model="emailOption" value="new" name="emailOption"/>
            <span>Указать другой email</span>
          </label>
          <input
              v-if="emailOption === 'new'"
              v-model="newEmail"
              type="email"
              class="tfa-modal__input"
              placeholder="Введите новый email"
          />
        </div>

        <p v-if="error" class="tfa-modal__error">{{ error }}</p>

        <div class="tfa-modal__buttons">
          <button class="tfa-modal__btn tfa-modal__btn--secondary" @click="close">Отмена</button>
          <button class="tfa-modal__btn tfa-modal__btn--primary" :disabled="loading" @click="startEnable">
            {{ loading ? 'Отправка...' : 'Продолжить' }}
          </button>
        </div>
      </template>

      <!-- Шаг 2: Ввод кода (включение) -->
      <template v-if="step === 'verify-enable'">
        <h3 class="tfa-modal__title">Введите код подтверждения</h3>
        <p class="tfa-modal__subtitle">Код отправлен на {{ targetEmail }}</p>

        <OtpInput
            ref="otpRef"
            :error="error"
            :loading="loading"
            :cooldown="60"
            @complete="verifyEnable"
            @resend="resendCode"
        />

        <div class="tfa-modal__buttons">
          <button class="tfa-modal__btn tfa-modal__btn--secondary" @click="close">Отмена</button>
        </div>
      </template>

      <!-- Шаг 3: Подтверждение отключения -->
      <template v-if="step === 'confirm-disable'">
        <h3 class="tfa-modal__title">Отключить двухфакторную аутентификацию</h3>
        <p class="tfa-modal__subtitle">На ваш email будет отправлен код подтверждения</p>

        <p v-if="error" class="tfa-modal__error">{{ error }}</p>

        <div class="tfa-modal__buttons">
          <button class="tfa-modal__btn tfa-modal__btn--secondary" @click="close">Отмена</button>
          <button class="tfa-modal__btn tfa-modal__btn--primary" :disabled="loading" @click="startDisable">
            {{ loading ? 'Отправка...' : 'Отключить' }}
          </button>
        </div>
      </template>

      <!-- Шаг 4: Ввод кода (отключение) -->
      <template v-if="step === 'verify-disable'">
        <h3 class="tfa-modal__title">Введите код подтверждения</h3>
        <p class="tfa-modal__subtitle">Код отправлен на ваш email</p>

        <OtpInput
            ref="otpRef"
            :error="error"
            :loading="loading"
            :cooldown="60"
            @complete="verifyDisable"
            @resend="resendCode"
        />

        <div class="tfa-modal__buttons">
          <button class="tfa-modal__btn tfa-modal__btn--secondary" @click="close">Отмена</button>
        </div>
      </template>

      <!-- Успех -->
      <template v-if="step === 'success'">
        <h3 class="tfa-modal__title">{{ successMessage }}</h3>
        <div class="tfa-modal__buttons">
          <button class="tfa-modal__btn tfa-modal__btn--primary" @click="close">Готово</button>
        </div>
      </template>
    </div>
  </GDialog>
</template>

<script setup>
import {ref, computed} from 'vue'
import {GDialog} from 'gitart-vue-dialog'
import axios from 'axios'
import OtpInput from '@/components/includes/OtpInput.vue'

const props = defineProps({
  modelValue: {type: Boolean, default: false},
  currentEmail: {type: String, default: ''},
  twoFactorEnabled: {type: Boolean, default: false}
})

const emit = defineEmits(['update:modelValue', 'updated'])

const step = ref('')
const emailOption = ref('current')
const newEmail = ref('')
const error = ref('')
const loading = ref(false)
const successMessage = ref('')
const otpRef = ref(null)

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const maskedCurrentEmail = computed(() => {
  const email = props.currentEmail
  if (!email) return 'не указан'
  const [local, domain] = email.split('@')
  if (!domain) return email
  const masked = local.length > 2
      ? local[0] + '***' + local[local.length - 1]
      : local[0] + '***'
  return masked + '@' + domain
})

const targetEmail = computed(() => {
  return emailOption.value === 'new' && newEmail.value ? newEmail.value : props.currentEmail
})

const open = () => {
  error.value = ''
  loading.value = false
  emailOption.value = 'current'
  newEmail.value = ''
  step.value = props.twoFactorEnabled ? 'confirm-disable' : 'choose-email'
}

const close = () => {
  dialogVisible.value = false
}

const handleError = (err) => {
  const status = err.response?.status
  const message = err.response?.data

  if (status === 429) {
    const match = typeof message === 'string' && message.match(/(\d+)/)
    if (match && otpRef.value) {
      otpRef.value.startCooldown(parseInt(match[1]))
    }
    error.value = message || 'Превышен лимит попыток. Попробуйте позже.'
  } else if (status === 410) {
    error.value = 'Код истёк. Запросите новый код.'
  } else if (status === 404) {
    error.value = 'Код не найден. Запросите новый код.'
  } else if (status === 401) {
    error.value = typeof message === 'string' ? message : 'Неверный код подтверждения'
  } else if (status === 400) {
    error.value = typeof message === 'string' ? message : 'Ошибка запроса'
  } else {
    error.value = 'Произошла ошибка. Попробуйте позже.'
  }
}

const startEnable = async () => {
  error.value = ''
  if (emailOption.value === 'new' && !newEmail.value) {
    error.value = 'Введите email'
    return
  }

  loading.value = true
  try {
    const payload = emailOption.value === 'new' ? {email: newEmail.value} : {}
    await axios.post('2fa/enable', payload)
    step.value = 'verify-enable'
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}

const verifyEnable = async (code) => {
  error.value = ''
  loading.value = true
  try {
    await axios.post('2fa/verify-enable', {
      email: targetEmail.value,
      code
    })
    successMessage.value = 'Двухфакторная аутентификация включена'
    step.value = 'success'
    emit('updated')
  } catch (err) {
    handleError(err)
    if (otpRef.value) otpRef.value.reset()
  } finally {
    loading.value = false
  }
}

const startDisable = async () => {
  error.value = ''
  loading.value = true
  try {
    await axios.post('2fa/disable')
    step.value = 'verify-disable'
  } catch (err) {
    handleError(err)
  } finally {
    loading.value = false
  }
}

const verifyDisable = async (code) => {
  error.value = ''
  loading.value = true
  try {
    await axios.post('2fa/verify-disable', {code})
    successMessage.value = 'Двухфакторная аутентификация отключена'
    step.value = 'success'
    emit('updated')
  } catch (err) {
    handleError(err)
    if (otpRef.value) otpRef.value.reset()
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  error.value = ''
  try {
    await axios.post('2fa/resend', {email: targetEmail.value})
    if (otpRef.value) otpRef.value.startCooldown(60)
  } catch (err) {
    handleError(err)
  }
}

defineExpose({open})
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.tfa-modal {
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__title {
    font-size: 22px;
    color: $pr1;
    text-align: center;
  }

  &__subtitle {
    font-size: 14px;
    color: $sc5;
    text-align: center;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 15px;
    background: $pr3;
    border-radius: 10px;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    color: $sc1;
    cursor: pointer;

    input[type="radio"] {
      accent-color: $pr1;
    }

    strong {
      color: $pr1;
    }
  }

  &__input {
    font-size: 16px;
    padding: 8px 12px;
    border: 1px solid $sc2;
    border-radius: 10px;
    background: $sc3;
    width: 100%;
    box-sizing: border-box;

    &:focus {
      border-color: $pr1;
      outline: none;
    }
  }

  &__error {
    color: crimson;
    font-size: 14px;
    text-align: center;
  }

  &__buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  &__btn {
    font-size: 16px;
    padding: 8px 24px;
    border-radius: 10px;
    cursor: pointer;
    border: none;

    &--primary {
      background: $pr1;
      color: white;

      &:hover:not(:disabled) {
        opacity: 0.9;
      }

      &:disabled {
        opacity: 0.5;
        cursor: default;
      }
    }

    &--secondary {
      background: $sc3;
      color: $pr1;

      &:hover {
        background: $sc2;
      }
    }
  }
}
</style>
