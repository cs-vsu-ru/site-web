<script setup>
import { ref, computed, onMounted } from 'vue'
import { parserAxios } from '@/main'
import Loader from '@/components/includes/Loader'
import { userAuth } from '@/store/userAuth'

const store = userAuth()
const scheduleData = ref(null)
const isLoading = ref(false)
const userRole = ref('')
const dialogState = ref(false)
const subjectName = ref('')
const courseNGroups = ref('')
const placement = ref('')
const lessonId = ref(null)
const zoom = ref(1)

const zoomIn = () => {
  if (zoom.value < 2) {
    zoom.value += 0.1
  }
}

const zoomOut = () => {
  if (zoom.value > 0.4) {
    zoom.value -= 0.1
  }
}

const isEditable = computed(() => {
  return userRole.value === 'ADMIN' || userRole.value === 'MODERATOR'
})

const hasDifferentSecondLesson = lesson => {
  return lesson.length > 1
}

const openModal = (name, course, room, id) => {
  dialogState.value = true
  subjectName.value = name
  courseNGroups.value = course
  placement.value = room
  lessonId.value = id
}

const loadSchedule = async () => {
  isLoading.value = true
  try {
    const response = await parserAxios.get('lessons/')
    scheduleData.value = response.data
  } catch (err) {
    console.error('Ошибка загрузки расписания', err)
  } finally {
    isLoading.value = false
  }
}

const saveSchedule = async () => {
  try {
    await parserAxios.patch(`lessons/${lessonId.value}/`, {
      groups: courseNGroups.value,
      placement: placement.value,
      name: subjectName.value
    })
    location.reload()
  } catch (err) {
    console.error('Ошибка при сохранении', err)
  }
}

const deleteLesson = async () => {
  try {
    await parserAxios.patch(`lessons/${lessonId.value}/`, {
      groups: '',
      placement: '',
      name: ''
    })
    location.reload()
  } catch (err) {
    console.error('Ошибка при удалении', err)
  }
}

onMounted(() => {
  userRole.value = store.getRole
  loadSchedule()
})
</script>

<template>
  <section v-if="scheduleData" class="full-schedule">
    <h1>Расписание</h1>
    <a :href="parserAxios.defaults.baseURL + 'lessons/xlsx/'" class="admin-button schedule-load">
      Скачать расписание
    </a>
    <div class="zoom-controls">
      <button @click="zoomOut" aria-label="Уменьшить масштаб">–</button>
      <button @click="zoomIn" aria-label="Увеличить масштаб">+</button>
    </div>
    <div class="table-wrapper">
      <div class="schedule-container" :style="{ zoom: zoom }">
        <table class="schedule-table">
          <thead>
          <tr>
            <th class="sticky-col day-col">День</th>
            <th class="sticky-col time-col">Время</th>
            <th v-for="teacher in scheduleData.employees" :key="teacher.id" class="teacher-col">
              <router-link class="schedule-link" :to="`/schedule/${teacher.id}`">
                {{ teacher.name }}
              </router-link>
            </th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(day, dIndex) in scheduleData.schedule" :key="dIndex">
            <tr v-for="(time, tIndex) in day.times" :key="tIndex">
              <td v-if="tIndex === 0" class="sticky-col day-col" :rowspan="day.times.length">
                {{ day.weekday }}
              </td>
              <td class="sticky-col time-col">{{ time.time }}</td>
              <td v-for="(lesson, lIndex) in time.lessons" :key="lIndex" class="lesson-cell">
                  <div class="lesson-part" :class="{ editable: isEditable }">
                    {{ lesson[0].name }} {{ lesson[0].groups }} {{ lesson[0].placement }}
                    <button
                        v-if="isEditable"
                        @click="openModal(lesson[0].name, lesson[0].groups, lesson[0].placement, lesson[0].id)"
                        class="edit-btn">
                      <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z">
                          </path>
                        </g>
                      </svg>
                    </button>
                  </div>
                  <hr class="lesson-divider" v-if="hasDifferentSecondLesson(lesson)" />
                  <div class="lesson-part" :class="{ editable: isEditable }">
                    {{ lesson[1].name }} {{ lesson[1].groups }} {{ lesson[1].placement }}
                    <button
                        v-if="isEditable"
                        @click="openModal(lesson[1].name, lesson[1].groups, lesson[1].placement, lesson[1].id)"
                        class="edit-btn">
                      <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z">
                          </path>
                        </g>
                      </svg>
                    </button>
                </div>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
    <GDialog v-model="dialogState" :max-width="500" v-if="userRole === 'ADMIN' || userRole === 'MODERATOR'">
      <form @submit.prevent="saveSchedule" class="login-modal">
        <div class="login-modal__inputs">
          <div class="login-modal__inputs-item">
            <p class="login-modal__inputs-item_name">Название предмета</p>
            <input type="text" class="login-modal__inputs-item_input" v-model="subjectName" required>
          </div>
          <div class="login-modal__inputs-item">
            <p class="login-modal__inputs-item_name">Курc и группы</p>
            <input type="text" class="login-modal__inputs-item_input" v-model="courseNGroups" required>
          </div>
          <div class="login-modal__inputs-item">
            <p class="login-modal__inputs-item_name">Аудитория</p>
            <input type="text" class="login-modal__inputs-item_input" v-model="placement" required>
          </div>
        </div>
        <button type="submit" class="login-modal__submit">Сохранить</button>
        <button @click="deleteLesson" type="button" class="login-modal__submit delete">Удалить</button>
      </form>
    </GDialog>
  </section>
  <Loader v-if="isLoading" />
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.full-schedule {
  max-width: 1440px;
  margin: 0 auto;
  position: relative;

  h1 {
    margin-bottom: 30px;
  }
}

.table-wrapper {
  max-width: 1440px;
  max-height: 800px;
  width: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: $pr1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: $sc4;
  }
}

.schedule-container {
  display: inline-block;
}

.schedule-table {
  width: 100%;
  min-width: 4500px;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;

  th,
  td {
    border: 1px solid $sc5;
    padding: 8px 0;
    text-align: center;
    white-space: nowrap;
  }

  thead th {
    position: sticky;
    top: 0;
    background: $sc4;
    color: black;
    z-index: 5;
  }

  thead th.day-col,
  thead th.time-col {
    background: $sc4;
    z-index: 6;
  }
}

.sticky-col {
  background: white;
  position: sticky;
  z-index: 3;
  background-clip: padding-box;
}

.day-col {
  left: 0;
  width: 150px;
  position: sticky;
  background: $sc4;
}

.time-col {
  left: 150px;
  width: 150px;
  position: sticky;
  background: $sc4;
}

.teacher-col {
  min-width: 200px;
}

.schedule-link {
  display: block;
  width: 100%;
  height: 100%;
  line-height: 1.5;
  text-decoration: none;
  color: inherit;
  transition: background 0.3s;
}

.lesson-cell {
  min-width: 200px;
  min-height: 300px;
  height: 100%;
  position: relative;
  vertical-align: middle;
  padding: 0 !important;
  width: 100%;
  white-space: normal;
  box-sizing: border-box;
}

.edit-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
  transition: transform 0.1s ease, opacity 0.3s ease;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
  z-index: 2;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.lesson-part {
  position: relative;
  background-color: white;
  transition: background-color 0.3s;
  flex: 1;
  min-height: 100px;
  white-space: normal !important;
  vertical-align: middle;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  display: flex;
  height: 100%;

  &:hover {
    background-color: white;
  }
  &.editable:hover::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    z-index: 1;
  }
  &:hover .edit-btn {
    opacity: 1;
    pointer-events: auto;
  }
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  button {
    background-color: $pr1;
    border: none;
    color: $sc2;
    padding: 8px 16px;
    font-size: 1.2rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;

    &:hover {
      background-color: darken($pr1, 10%);
    }
    &:active {
      transform: scale(0.95);
    }
  }
}

.lesson-divider {
  border: none;
  height: 2px;
  background-color: $sc5;
}
</style>
