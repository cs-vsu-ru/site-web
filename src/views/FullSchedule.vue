<script setup>
import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue'
import {parserAxios} from '@/main'
import Loader from '@/components/includes/Loader'
import {userAuth} from '@/store/userAuth'
import {GDialog} from 'gitart-vue-dialog'

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
const isFullscreen = ref(false)
const hideEmptyTeachers = ref(false)
const selectedTeacherIds = ref([])
const isOpen = ref(false)
const multiselectRef = ref(null)
const selectedDays = ref([])
const isDaysOpen = ref(false)
const daysMultiselectRef = ref(null)
const parseErrors = ref([])
const parseErrorsExpanded = ref(false)
const downloadError = ref('')
const selectAllDaysCheckbox = ref(null)
const selectAllTeachersCheckbox = ref(null)

const downloadSchedule = async () => {
  downloadError.value = ''
  try {
    const response = await parserAxios.get('lessons/xlsx/', { responseType: 'blob' })
    const url = window.URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = url
    link.download = 'расписание.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    downloadError.value = 'Не удалось скачать расписание. Попробуйте позже'
    setTimeout(() => { downloadError.value = '' }, 5000)
  }
}

const zoomIn = () => {
  if (zoom.value < 2) zoom.value += 0.1
}

const zoomOut = () => {
  if (zoom.value > 0.4) zoom.value -= 0.1
}

const isEditable = computed(() => {
  return userRole.value === 'ADMIN' || userRole.value === 'MODERATOR'
})

const selectedTeacherSet = computed(() => new Set(selectedTeacherIds.value))

const selectedDaysSet = computed(() => new Set(selectedDays.value))

const visibleSchedule = computed(() => {
  if (!scheduleData.value) return []
  return scheduleData.value.schedule.filter(day => selectedDaysSet.value.has(day.weekday))
})

const teacherHasLessons = computed(() => {
  return scheduleData.value.employees.map((_, index) =>
      visibleSchedule.value.some(day =>
          day.times.some(time =>
              time.lessons[index].some(lesson => lesson.name.trim() !== '')
          )
      )
  )
})

const teachersWithLessons = computed(() => {
  return scheduleData.value.employees
      .filter((_, index) => teacherHasLessons.value[index])
      .map(teacher => teacher.id)
})

const visibleTeacherIndices = computed(() => {
  const set = selectedTeacherSet.value
  const result = []
  scheduleData.value.employees.forEach((teacher, index) => {
    if (set.has(teacher.id)) result.push(index)
  })
  return result
})

const toggleSelectAll = () => {
  if (selectedTeacherIds.value.length === scheduleData.value.employees.length) {
    selectedTeacherIds.value = []
  } else {
    selectedTeacherIds.value = scheduleData.value.employees.map(teacher => teacher.id)
  }
}

const selectAllState = computed(() => {
  if (!scheduleData.value) return 'unchecked'
  const totalTeachers = scheduleData.value.employees.length
  const selectedCount = selectedTeacherIds.value.length
  if (selectedCount === 0) return 'unchecked'
  if (selectedCount === totalTeachers) return 'checked'
  return 'indeterminate'
})

const toggleTeacher = (id) => {
  if (selectedTeacherSet.value.has(id)) {
    selectedTeacherIds.value = selectedTeacherIds.value.filter(tId => tId !== id)
  } else {
    selectedTeacherIds.value = [...selectedTeacherIds.value, id]
  }
}

const allDays = computed(() => {
  if (!scheduleData.value) return []
  return scheduleData.value.schedule.map(day => day.weekday)
})

const toggleDaySelectAll = () => {
  if (selectedDays.value.length === allDays.value.length) {
    selectedDays.value = []
  } else {
    selectedDays.value = [...allDays.value]
  }
}

const selectAllDaysState = computed(() => {
  if (!scheduleData.value) return 'unchecked'
  const total = allDays.value.length
  const selected = selectedDays.value.length
  if (selected === 0) return 'unchecked'
  if (selected === total) return 'checked'
  return 'indeterminate'
})

const toggleDay = (day) => {
  if (selectedDaysSet.value.has(day)) {
    selectedDays.value = selectedDays.value.filter(d => d !== day)
  } else {
    selectedDays.value = [...selectedDays.value, day]
  }
}

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const toggleDaysOpen = () => {
  isDaysOpen.value = !isDaysOpen.value
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

const handleClickOutside = (event) => {
  if (multiselectRef.value && !multiselectRef.value.contains(event.target)) {
    isOpen.value = false
  }
  if (daysMultiselectRef.value && !daysMultiselectRef.value.contains(event.target)) {
    isDaysOpen.value = false
  }
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
    selectedTeacherIds.value = scheduleData.value.employees.map(teacher => teacher.id)
    selectedDays.value = scheduleData.value.schedule.map(day => day.weekday)
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

const fieldLabels = {
  row: 'Строка',
  course: 'Курс',
  group: 'Группа',
  course_map: 'Соответствие курса',
  cell: 'Ячейка',
  cell_format_skipped: 'Формат ячейки',
  lesson_meta: 'Метаданные занятия'
}

const areLessonsEqual = (lessons) => {
  return lessons.length === 2
      && lessons[0].name === lessons[1].name
      && lessons[0].groups === lessons[1].groups
      && lessons[0].placement === lessons[1].placement
}

const dismissParseErrors = () => {
  parseErrors.value = []
  sessionStorage.removeItem('scheduleParseErrors')
}

onMounted(() => {
  userRole.value = store.getRole
  loadSchedule()
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)

  const stored = sessionStorage.getItem('scheduleParseErrors')
  if (stored) {
    try {
      parseErrors.value = JSON.parse(stored)
    } catch (_) {}
    sessionStorage.removeItem('scheduleParseErrors')
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

const hasActiveFilters = computed(() => {
  if (!scheduleData.value) return false
  return hideEmptyTeachers.value
      || selectedDays.value.length !== allDays.value.length
      || selectedTeacherIds.value.length !== scheduleData.value.employees.length
})

const resetFilters = () => {
  hideEmptyTeachers.value = false
  selectedDays.value = [...allDays.value]
  selectedTeacherIds.value = scheduleData.value.employees.map(teacher => teacher.id)
}

const applyHideEmpty = () => {
  const withLessons = new Set(teachersWithLessons.value)
  selectedTeacherIds.value = selectedTeacherIds.value.filter(id => withLessons.has(id))
}

watch(hideEmptyTeachers, (newVal) => {
  if (newVal) {
    applyHideEmpty()
  } else {
    selectedTeacherIds.value = scheduleData.value.employees.map(teacher => teacher.id)
  }
})

watch(selectedDays, () => {
  if (hideEmptyTeachers.value) {
    applyHideEmpty()
  }
}, {deep: true})

watch(selectedTeacherIds, (newVal) => {
  const withLessons = new Set(teachersWithLessons.value)
  if (newVal.some(id => !withLessons.has(id))) {
    hideEmptyTeachers.value = false
  }
}, {deep: true})

watch(selectAllDaysState, (state) => {
  if (selectAllDaysCheckbox.value) {
    selectAllDaysCheckbox.value.indeterminate = state === 'indeterminate'
  }
})

watch(selectAllState, (state) => {
  if (selectAllTeachersCheckbox.value) {
    selectAllTeachersCheckbox.value.indeterminate = state === 'indeterminate'
  }
})
</script>

<template>
  <section v-if="scheduleData" class="full-schedule">
    <h1>Расписание</h1>
    <div v-if="parseErrors.length" class="parse-warnings">
      <div class="parse-warnings__header">
        <span>Расписание загружено, но обнаружены проблемы ({{ parseErrors.length }})</span>
        <div class="parse-warnings__actions">
          <button @click="parseErrorsExpanded = !parseErrorsExpanded" class="parse-warnings__toggle">
            {{ parseErrorsExpanded ? 'Свернуть' : 'Подробнее' }}
          </button>
          <button @click="dismissParseErrors" class="parse-warnings__close">&times;</button>
        </div>
      </div>
      <div v-if="parseErrorsExpanded" class="parse-warnings__details">
        <div v-for="(error, i) in parseErrors" :key="i" class="parse-warnings__item">
          <span class="parse-warnings__field">{{ fieldLabels[error.field] || error.field }}</span>
          <span v-if="error.row != null || error.col != null" class="parse-warnings__location">
            ({{ error.row != null ? `строка ${error.row}` : '' }}{{ error.row != null && error.col != null ? ', ' : '' }}{{ error.col != null ? `столбец ${error.col}` : '' }})
          </span>
          <span class="parse-warnings__message">{{ error.message }}</span>
        </div>
      </div>
    </div>
    <button @click="downloadSchedule" class="admin-button schedule-load">
      Скачать расписание
    </button>
    <div v-if="downloadError" class="download-error">
      {{ downloadError }}
    </div>
    <div class="controls">
      <label>
        <input type="checkbox" v-model="hideEmptyTeachers"/>
        Скрыть преподавателей без занятий
      </label>
    </div>
    <div class="filters-row">
    <div class="filter-group">
    <h3>Дни недели:</h3>
    <div class="multiselect" ref="daysMultiselectRef">
      <div class="multiselect-toggle" @click="toggleDaysOpen">
        <span>{{
            selectedDays.length > 0 ? `Выбрано: ${selectedDays.length} дней` : 'Выберите дни'
          }}</span>
        <span>▼</span>
      </div>
      <div class="multiselect-list" v-show="isDaysOpen">
        <ul>
          <li>
            <label>
              <input type="checkbox"
                     ref="selectAllDaysCheckbox"
                     :checked="selectAllDaysState === 'checked'"
                     @change="toggleDaySelectAll"/>
              Выбрать все
            </label>
          </li>
          <li v-for="day in allDays" :key="day">
            <label>
              <input type="checkbox"
                     :checked="selectedDaysSet.has(day)"
                     @change="toggleDay(day)"/>
              {{ day }}
            </label>
          </li>
        </ul>
      </div>
    </div>
    </div>
    <div class="filter-group">
    <h3>Преподаватели:</h3>
    <div class="multiselect" ref="multiselectRef">
      <div class="multiselect-toggle" @click="toggleOpen">
        <span>{{
            selectedTeacherIds.length > 0 ? `Выбрано: ${selectedTeacherIds.length} преподавателей` : 'Выберите преподавателей'
          }}</span>
        <span>▼</span>
      </div>
      <div class="multiselect-list" v-show="isOpen">
        <ul>
          <li>
            <label>
              <input type="checkbox"
                     ref="selectAllTeachersCheckbox"
                     :checked="selectAllState === 'checked'"
                     @change="toggleSelectAll"/>
              Выбрать всех
            </label>
          </li>
          <li v-for="teacher in scheduleData.employees" :key="teacher.id">
            <label>
              <input type="checkbox"
                     :value="teacher.id"
                     :checked="selectedTeacherSet.has(teacher.id)"
                     @change="toggleTeacher(teacher.id)"/>
              {{ teacher.name }}
            </label>
          </li>
        </ul>
      </div>
    </div>
    </div>
    <button v-show="hasActiveFilters" class="reset-filters-btn" @click="resetFilters">Сбросить фильтры</button>
    </div>
    <div class="zoom-controls">
      <button @click="zoomOut" aria-label="Уменьшить масштаб">–</button>
      <button @click="zoomIn" aria-label="Увеличить масштаб">+</button>
      <button @click="isFullscreen=true" class="fullscreen-btn" aria-label="Полноэкранный режим">
        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3H9V5H5V9H3V3ZM15 3H21V9H19V5H15V3ZM19 15H21V21H15V19H19V15ZM5 19V15H3V21H9V19H5Z" fill="white"/>
        </svg>
      </button>
    </div>
    <div class="table-wrapper" :class="{ 'table-wrapper--fullscreen': isFullscreen }">
      <button v-if="isFullscreen" @click="isFullscreen=false" class="fullscreen-close-btn" aria-label="Закрыть полноэкранный режим">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 1 0-1.41 1.42L10.59 12l-4.89 4.88a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z" fill="white"/>
        </svg>
      </button>
      <div class="schedule-container" :style="{ zoom: zoom }">
        <table class="schedule-table">
          <thead>
          <tr>
            <th class="sticky-col day-col">День</th>
            <th class="sticky-col time-col">Время</th>
            <th v-for="index in visibleTeacherIndices"
                :key="scheduleData.employees[index].id"
                class="teacher-col">
              <router-link class="schedule-link" :to="`/schedule/${scheduleData.employees[index].id}`">
                {{ scheduleData.employees[index].name }}
              </router-link>
            </th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(day, dIndex) in visibleSchedule" :key="dIndex">
            <tr v-for="(time, tIndex) in day.times" :key="tIndex">
              <td v-if="tIndex === 0" class="sticky-col day-col" :rowspan="day.times.length">
                {{ day.weekday }}
              </td>
              <td class="sticky-col time-col">{{ time.time }}</td>
              <td v-for="index in visibleTeacherIndices"
                  :key="index"
                  class="lesson-cell">
                <template v-for="(singleLesson, sIndex) in time.lessons[index]" :key="sIndex">
                  <template v-if="!(sIndex === 1 && areLessonsEqual(time.lessons[index]))">
                  <div class="lesson-part" :class="{ editable: isEditable, 'lesson-part--merged': areLessonsEqual(time.lessons[index]) }">
                    {{ singleLesson.name }} {{ singleLesson.groups }} {{ singleLesson.placement }}
                    <button v-if="isEditable"
                            @click="openModal(singleLesson.name, singleLesson.groups, singleLesson.placement, singleLesson.id)"
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
                  <hr v-if="sIndex < time.lessons[index].length - 1 && !areLessonsEqual(time.lessons[index])" class="lesson-divider"/>
                  </template>
                </template>
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
  <Loader v-if="isLoading"/>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.full-schedule {
  max-width: 1441px;
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
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

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
  width: 200px;
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
    color: white;
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

  .fullscreen-btn {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
  }
}

.table-wrapper--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: none;
  max-height: none;
  z-index: 1000;
  background: white;
}

.fullscreen-close-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1001;
  background-color: $pr1;
  color: $sc2;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;

  &:hover {
    background-color: darken($pr1, 10%);
  }

  &:active {
    transform: scale(0.95);
  }
}

.lesson-part--merged {
  height: 100%;
}

.lesson-divider {
  border: none;
  height: 2px;
  background-color: $sc5;
}

.controls {
  margin-bottom: 20px;
}

.reset-filters-btn {
  background: none;
  border: none;
  color: $pr1;
  text-decoration: underline;
  font-size: 1rem;
  cursor: pointer;
  margin-left: auto;
  align-self: flex-end;
  margin-bottom: 28px;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
}

.filters-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.filter-group {
  h3 {
    margin-bottom: 0;
  }
}

.multiselect {
  position: relative;
  width: 300px;
  margin-bottom: 20px;
  margin-top: 10px;
}

.multiselect-toggle {
  padding: 8px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.multiselect-toggle span {
  margin-right: 10px;
}

.multiselect-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.multiselect-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.multiselect-list li {
  padding: 5px 10px;
}

.multiselect-list label {
  display: flex;
  align-items: center;
}

.multiselect-list input[type="checkbox"] {
  margin-right: 10px;
}

.parse-warnings {
  margin-bottom: 20px;
  padding: 12px 16px;
  background-color: #fff8e1;
  border: 1px solid #ffe082;
  border-radius: 6px;
  font-size: 14px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    color: #e65100;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__toggle {
    background: none;
    border: none;
    color: $pr1;
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
  }

  &__close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #999;
    padding: 0 4px;
    line-height: 1;

    &:hover {
      color: #333;
    }
  }

  &__details {
    margin-top: 12px;
    max-height: 300px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__item {
    padding: 6px 8px;
    background-color: #fff3e0;
    border-radius: 4px;
    color: #333;
  }

  &__field {
    font-weight: 500;
  }

  &__location {
    color: #888;
    margin: 0 4px;
  }

  &__message {
    margin-left: 4px;
  }
}

.download-error {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 12px 16px;
  background-color: #fdecea;
  color: #b71c1c;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  font-size: 14px;
}
</style>