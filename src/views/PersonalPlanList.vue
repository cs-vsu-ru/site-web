<template>
  <div class="plans__field">
    <div v-for="employee in employeesArr" class="employee-plan">
      <div class="employee-info">
        <p class="employee-name">
          {{ employee.lastName }} {{ employee.firstName }} {{ employee.patronymic }}
        </p>
        <p class="employee-position">{{ employee.post }}</p>
      </div>

      <div class="employee-actions">
        <a
            v-if="employee.plan"
            :href="employee.plan"
            class="download-button admin-button"
            download
        >
          Скачать текущий план
        </a>
        <button class="upload-button admin-button">
          Загрузить план
          <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload($event, employee)"
              accept=".pdf"
              class="file-input"
          >
        </button>
      </div>
    </div>
    <Loader v-if="isLoading"/>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import Loader from '@/components/includes/Loader';

let employeesArr = ref([]);
const isLoading = ref(false);
const fileInput = ref(null);

const fetchEmployees = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('employees');
    employeesArr.value = response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleFileUpload = async (event, employee) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    isLoading.value = true;

    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await axios.post('upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    await axios.patch(`employees/${employee.id}`, {
      id: employee.id,
      plan: uploadResponse.data
    });

    await fetchEmployees();

  } catch (error) {
    console.error('Error uploading plan:', error);
    alert('Ошибка при загрузке плана');
  } finally {
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchEmployees();
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.plans__field {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.employee-plan {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: $pr3;
}

.employee-info {
  flex: 1;
}

.employee-name {
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 5px;
}

.employee-position {
  color: #666;
  font-size: 14px;
}

.employee-actions {
  display: flex;
  gap: 10px;
}

.upload-button {
  position: relative;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>
