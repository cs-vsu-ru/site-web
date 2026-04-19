<template>
  <section class="profile" v-if="student">
    <div class="profile__left">
      <div class="profile__left-block">
        <img
          v-if="student.imageUrl"
          :src="`${API_FILES_URL}/${student.imageUrl}`"
          alt=""
          class="profile__left-block_image"
        />
      </div>
      <div class="profile__left-buttons">
        <a
          class="profile__left-buttons_email"
          :href="'mailto: ' + student.email"
        >
          {{ student.email }}
        </a>
      </div>
    </div>

    <div class="profile__right">
      <p class="profile__right-name">
        {{ fullName }}
      </p>
      <p v-if="student.course" class="profile__right-item">
        Курс
        <span>{{ student.course }}</span>
      </p>
      <p v-if="student.group" class="profile__right-item">
        Группа
        <span>{{ student.group }}</span>
      </p>
      <p v-if="student.startYear || student.endYear" class="profile__right-item">
        Годы обучения
        <span>{{ student.startYear }} - {{ student.endYear }}</span>
      </p>
      <p class="profile__right-item">
        Научный руководитель
        <span>{{ scientificSupervisorName || "-" }}</span>
      </p>
      <p class="profile__right-item">
        Тема ВКР
        <span>{{ student.courseJob || "-" }}</span>
      </p>
      <p v-if="student.departmentInfo" class="profile__right-item">
        Кафедра
        <span>{{ student.departmentInfo }}</span>
      </p>
    </div>

    <div
      v-if="currUserId === student.id"
      class="profile__tfa"
    >
      <button class="admin-button" @click="openTwoFactor">
        {{ student.twoFactorEnabled ? "Отключить 2FA" : "Подключить 2FA" }}
      </button>
    </div>

    <TwoFactorSetup
      ref="tfaRef"
      v-model="tfaDialogState"
      :current-email="student.email"
      :two-factor-enabled="student.twoFactorEnabled"
      @updated="refreshProfile"
    />
  </section>
  <Loader v-if="isLoading" />
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import Loader from "@/components/includes/Loader";
import TwoFactorSetup from "@/components/includes/TwoFactorSetup.vue";
import { API_FILES_URL } from "@/main";

const route = useRoute();

const student = ref(null);
const currUserId = ref(null);
const isLoading = ref(false);
const tfaDialogState = ref(false);
const tfaRef = ref(null);
const employeeOptions = ref([]);

const destinationId = computed(() => route.params.id);
const fullName = computed(() =>
  student.value
    ? `${student.value.lastName} ${student.value.firstName} ${student.value.patronymic}`
    : "",
);

const employeeNameById = (id) => {
  if (!id) return "";
  const employee = employeeOptions.value.find((item) => item.id === id);
  return employee ? employee.fullName : "";
};

const scientificSupervisorName = computed(() =>
  employeeNameById(student.value?.scientificSupervisor),
);

const normalizeResponse = (data) => (Array.isArray(data) ? data[0] : data);

const getStudentAccount = async () => {
  const response = await axios.get("student/account");
  return normalizeResponse(response.data);
};

const getStudentById = async (id) => {
  const response = await axios.get(`student/${id}`);
  return normalizeResponse(response.data);
};

const getEmployees = async () => {
  const response = await axios.get("employees");
  employeeOptions.value = response.data.map((employee) => ({
    id: employee.id,
    fullName: `${employee.lastName} ${employee.firstName} ${employee.patronymic}`,
  }));
};

const loadStudentProfile = async () => {
  isLoading.value = true;
  try {
    await getEmployees();
    const currentStudent = await getStudentAccount();
    currUserId.value = currentStudent?.id ?? null;

    if (currentStudent?.id == destinationId.value) {
      student.value = currentStudent;
      return;
    }

    student.value = await getStudentById(destinationId.value);
  } finally {
    isLoading.value = false;
  }
};

const refreshProfile = async () => {
  await loadStudentProfile();
};

const openTwoFactor = () => {
  tfaDialogState.value = true;
  setTimeout(() => {
    if (tfaRef.value) tfaRef.value.open();
  });
};

onMounted(() => {
  loadStudentProfile();
});

watch(
  () => route.params.id,
  () => {
    loadStudentProfile();
  },
);
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.profile {
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

  &__left {
    background: #c2eeff;
    padding: 20px;
    max-width: 385px;
    width: 100%;
    border-radius: 25px;

    &-block {
      width: 345px;
      height: 345px;
      background: $sc3;
      border-radius: 15px;

      &_image {
        width: 345px;
        height: 345px;
        object-fit: contain;
      }
    }

    &-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 30px;

      &_email {
        font-size: 22px;
        line-height: 24px;
        text-align: center;
        color: $pr1;
        font-weight: 600;
        margin-top: 10px;
      }
    }
  }

  &__right {
    background: #c2eeff;
    width: 100%;
    border-radius: 25px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    &-name {
      font-size: 40px;
      line-height: 47px;
      color: $pr1;
    }

    &-item {
      font-size: 24px;
      line-height: 28px;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
      color: $pr1;

      & span {
        font-size: 18px;
        line-height: 22px;
      }
    }
  }

  &__tfa {
    position: absolute;
    right: 30px;
    bottom: 30px;
  }
}
</style>
