<template>
  <section class="teachers-all">
    <h1 class="teachers-all__title">Сотрудники</h1>
    <div style="display: flex; gap: 10px; margin-bottom: 40px">
      <select v-model="sortOption" class="admin-button" style="padding: 5px 10px;">
        <option value="1">По ФИО (А-Я)</option>
        <option value="2">По ФИО (Я-А)</option>
      </select>
      <select v-model="filterOption" class="admin-button" style="padding: 5px 10px;">
        <option value="">Должность...</option>
        <option v-for="post in uniquePosts" :value="post">{{ post }}</option>
      </select>
      <input
          v-model="employeesSearchQuery"
          type="text"
          placeholder="Поиск..."
          class="employees-search-input admin-button"
          style="padding: 5px 10px; flex-grow: 1;"
      >
    </div>
    <div class="teachers__field">
      <router-link :to="'/profile/' + teacher.id" v-for="teacher in filteredAndSortedUsers" class="teacher">
        <img :src="`${API_FILES_URL}/${teacher.imageUrl}`" alt="" class="teacher__photo">
        <div class="teacher__data">
          <p class="teacher__data-name">{{ teacher.lastName }} <br> {{ teacher.firstName }} <br>
            {{ teacher.patronymic }}</p>
          <p class="teacher__data-status">{{ teacher.post }}</p>
          <a href="" class="teacher__data-email">{{ teacher.email }}</a>
        </div>
      </router-link>
    </div>
  </section>
  <Loader v-if="isLoading"/>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import Loader from '@/components/includes/Loader';
import { API_FILES_URL } from '@/main';

let teachersArr = ref([])
const isLoading = ref(false)
const sortOption = ref('1');
const filterOption = ref('');
const employeesSearchQuery = ref('');

onMounted(() => {
  teacherList()
})

const teacherList = async () => {
  isLoading.value = true

  await axios.get('employees')
      .then((req) => {
        teachersArr.value = req.data
        isLoading.value = false
      })
}

const uniquePosts = computed(() => {
  const posts = teachersArr.value.map(user => user.post);
  return [...new Set(posts)].filter(post => post);
});

const filteredAndSortedUsers = computed(() => {
  let users = [...teachersArr.value];

  if (employeesSearchQuery.value) {
    const query = employeesSearchQuery.value.toLowerCase();
    users = users.filter(user => {
      const fullName = `${user.lastName} ${user.firstName} ${user.patronymic}`.toLowerCase();
      return fullName.includes(query);
    });
  }

  if (filterOption.value) {
    users = users.filter(user => user.post === filterOption.value);
  }

  if (sortOption.value === '1') {
    return users.sort((a, b) => {
      const nameA = `${a.lastName} ${a.firstName} ${a.patronymic}`.toLowerCase();
      const nameB = `${b.lastName} ${b.firstName} ${b.patronymic}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  } else if (sortOption.value === '2') {
    return users.sort((a, b) => {
      const nameA = `${a.lastName} ${a.firstName} ${a.patronymic}`.toLowerCase();
      const nameB = `${b.lastName} ${b.firstName} ${b.patronymic}`.toLowerCase();
      return nameB.localeCompare(nameA);
    });
  }

  return users;
});

</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.teachers-all {
  max-width: 1440px;
  margin: 0 auto;

  @media (max-width: 1480px) {
    max-width: calc(100% - 40px);
  }

  &__title {
    margin-bottom: 40px;
  }

  select option {
    background: #fff !important;
  }

  .employees-search-input {
    background-color: unset;
    color: $pr1
  }
}
</style>
