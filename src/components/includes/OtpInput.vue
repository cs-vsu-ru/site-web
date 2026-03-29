<template>
  <div class="otp">
    <div class="otp__fields">
      <input
          v-for="(_, index) in digits"
          :key="index"
          ref="inputs"
          v-model="digits[index]"
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="otp__field"
          :disabled="loading"
          @input="onInput(index)"
          @keydown="onKeydown(index, $event)"
          @paste="onPaste"
      />
    </div>
    <p v-if="error" class="otp__error">{{ error }}</p>
    <div class="otp__actions">
      <button
          type="button"
          class="otp__resend"
          :disabled="resendCooldown > 0 || loading"
          @click="$emit('resend')"
      >
        {{ resendCooldown > 0 ? `Отправить повторно (${resendCooldown}с)` : 'Отправить повторно' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, onMounted, onUnmounted} from 'vue'

const props = defineProps({
  error: {type: String, default: ''},
  loading: {type: Boolean, default: false},
  cooldown: {type: Number, default: 0}
})

const emit = defineEmits(['complete', 'resend'])

const digits = ref(['', '', '', '', '', ''])
const inputs = ref([])
const resendCooldown = ref(0)
let cooldownTimer = null

const startCooldown = (seconds) => {
  clearInterval(cooldownTimer)
  resendCooldown.value = seconds
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownTimer)
    }
  }, 1000)
}

onMounted(() => {
  if (props.cooldown > 0) startCooldown(props.cooldown)
})

watch(() => props.cooldown, (val) => {
  if (val > 0) startCooldown(val)
})

const onInput = (index) => {
  const val = digits.value[index]
  if (!/^\d$/.test(val)) {
    digits.value[index] = ''
    return
  }
  if (index < 5) {
    inputs.value[index + 1].focus()
  }
  if (digits.value.every(d => /^\d$/.test(d))) {
    emit('complete', digits.value.join(''))
  }
}

const onKeydown = (index, event) => {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputs.value[index - 1].focus()
  }
}

const onPaste = (event) => {
  event.preventDefault()
  const paste = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  for (let i = 0; i < paste.length; i++) {
    digits.value[i] = paste[i]
  }
  const focusIndex = Math.min(paste.length, 5)
  inputs.value[focusIndex].focus()
  if (paste.length === 6) {
    emit('complete', paste)
  }
}

const reset = () => {
  digits.value = ['', '', '', '', '', '']
  if (inputs.value[0]) inputs.value[0].focus()
}

onUnmounted(() => {
  clearInterval(cooldownTimer)
})

defineExpose({reset, startCooldown})
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.otp {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  &__fields {
    display: flex;
    gap: 10px;
  }

  &__field {
    width: 48px;
    height: 56px;
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    border: 2px solid $sc2;
    border-radius: 10px;
    background: $sc3;
    color: $pr1;
    transition: border-color 0.2s;

    &:focus {
      border-color: $pr1;
      outline: none;
    }

    &:disabled {
      opacity: 0.5;
    }
  }

  &__error {
    color: crimson;
    font-size: 14px;
    text-align: center;
  }

  &__actions {
    display: flex;
    justify-content: center;
  }

  &__resend {
    font-size: 14px;
    color: $pr1;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    padding: 5px;

    &:disabled {
      color: $sc2;
      cursor: default;
      text-decoration: none;
    }
  }
}
</style>
