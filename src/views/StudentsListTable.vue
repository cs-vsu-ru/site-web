<template>
  <div class="custom-table">
    <!-- Поиск по почте -->
    <div class="email-search-wrapper">
      <input
          type="text"
          v-model="emailSearch"
          placeholder="Поиск по почте..."
          @input="searchByEmail"
          class="email-search-input"
      />
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
        <tr>
          <th
              v-for="col in columns"
              :key="col.key"
              :class="`col-${col.key}`"
              @click="sortBy(col.key)"
          >
            {{ col.label }}
            <span v-if="sortKey === col.key">
        {{ sortOrder === 'asc' ? '▲' : '▼' }}
      </span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="student in paginatedData" :key="student.id">
          <td @click="startEdit(student)">
            <template v-if="editedStudentId === student.id">
              <input
                  v-model="student.email"
                  @blur="stopEdit(student)"
                  @keyup.enter="stopEdit(student)"
                  :autofocus="true"
              />
            </template>
            <template v-else>
              <span :title="student.email">{{ student.email }}</span>
            </template>
          </td>

          <td @click="startEdit(student)">
            <template v-if="editedStudentId === student.id">
              <input
                  v-model="student.lastName"
                  @blur="stopEdit(student)"
                  @keyup.enter="stopEdit(student)"
                  :autofocus="true"
              />
            </template>
            <template v-else>
              <span :title="student.lastName">{{ student.lastName }}</span>
            </template>
          </td>

          <td @click="startEdit(student)">
            <template v-if="editedStudentId === student.id">
              <input
                  v-model="student.firstName"
                  @blur="stopEdit(student)"
                  @keyup.enter="stopEdit(student)"
                  :autofocus="true"
              />
            </template>
            <template v-else>
              <span :title="student.firstName">{{ student.firstName }}</span>
            </template>

          </td>

          <td @click="startEdit(student)">
            <template v-if="editedStudentId === student.id">
              <input
                  v-model="student.patronymic"
                  @blur="stopEdit(student)"
                  @keyup.enter="stopEdit(student)"
                  :autofocus="true"
              />
            </template>
            <template v-else>
              <span :title="student.patronymic">{{ student.patronymic }}</span>
            </template>
          </td>

          <td @click="startEdit(student)">
            <template v-if="editedStudentId === student.id">
              <input
                  v-model="student.course"
                  @blur="stopEdit(student)"
                  @keyup.enter="stopEdit(student)"
                  :autofocus="true"
              />
            </template>
            <template v-else>
              <span :title="student.course">{{ student.course }}</span>
            </template>
          </td>

          <td @click="startEdit(student)">
            <template v-if="editedStudentId === student.id">
              <input
                  v-model="student.group"
                  @blur="stopEdit(student)"
                  @keyup.enter="stopEdit(student)"
                  :autofocus="true"
              />
            </template>
            <template v-else>
              <span :title="student.group">{{ student.group }}</span>
            </template>
          </td>

          <td @click="startEdit(student)">
            <template v-if="editedStudentId === student.id">
              <select v-model="student.startYear" @blur="stopEdit(student)" @change="stopEdit(student)">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </template>
            <template v-else>
              <span :title="student.startYear">{{ student.startYear }}</span>
            </template>
          </td>

          <td @click="startEdit(student)">
            <template v-if="editedStudentId === student.id">
              <select v-model="student.endYear" @blur="stopEdit(student)" @change="stopEdit(student)">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </template>
            <template v-else>
              <span :title="student.endYear">{{ student.endYear }}</span>
            </template>
          </td>

          <td @click="startEdit(student)">
            <template v-if="editedStudentId === student.id">
              <select v-model="student.supervisor" @blur="stopEdit(student)" @change="stopEdit(student)">
                <option v-for="user in userList" :key="user.id" :value="user.id">{{ user.fullName }}</option>
              </select>
            </template>
            <template v-else>
              <span :title="student.supervisorName">{{ student.supervisorName }}</span>
            </template>
          </td>

          <td>
            <span :title="student.login">{{ student.login }}</span>
          </td>

          <td>
            <button @click="confirmDeleteStudent(student)" aria-label="Удалить"
                    title="Удалить студента"
                    style="background: none; border: none; padding: 0; cursor: pointer;">
              <svg width="20px" height="20px" viewBox="0 0 21 21" version="1.1"
                   xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#00295F">
                      <g id="icons" transform="translate(56.000000, 160.000000)">
                        <path
                            d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z"
                            id="delete-[#1487]"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          </td>

        </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">◀</button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">▶</button>
    </div>

    <GDialog v-model="deleteStudentDialogState" :max-width="400">
      <div class="delete-confirm-modal">
        <p>Вы уверены, что хотите удалить студента
          <strong>{{ studentToDelete?.lastName }} {{ studentToDelete?.firstName }} {{ studentToDelete?.patronymic }}</strong>?
        </p>
        <div class="delete-confirm-modal__actions">
          <button @click="deleteStudent" class="delete-confirm-modal__delete">Удалить</button>
          <button @click="deleteStudentDialogState = false">Отмена</button>
        </div>
      </div>
    </GDialog>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import axios from "axios";
import {GDialog} from "gitart-vue-dialog/dist/index";

const userList = ref([])
const studentsList = ref([])
const years = Array.from({length: 101}, (_, index) => 2025 - index)

const columns = [
  {key: 'email', label: 'Почта'},
  {key: 'lastName', label: 'Фамилия'},
  {key: 'firstName', label: 'Имя'},
  {key: 'patronymic', label: 'Отчество'},
  {key: 'course', label: 'Курс'},
  {key: 'group', label: 'Группа'},
  {key: 'startYear', label: 'Год нач.'},
  {key: 'endYear', label: 'Год оконч.'},
  {key: 'supervisorName', label: 'Руководитель'},
  {key: 'login', label: 'Логин'},
  {key: 'deleteCol', label: ''},
]

const emailSearch = ref('')

const sortKey = ref('')
const sortOrder = ref('asc')

onMounted(() => {
  getUsers()
  getStudents()
})

const getUsers = async () => {
  await axios.get('employees')
      .then((userData) => {
        userList.value = userData.data.map(user => ({
          id: user.id,
          fullName: `${user.lastName} ${user.firstName.charAt(0)}.${user.patronymic.charAt(0)}.`,
          firstName: user.firstName,
          lastName: user.lastName,
          patronymic: user.patronymic,
        }));
      });
}

const getStudents = async () => {
  await axios.get('students')
      .then((userData) => {
        studentsList.value = userData.data
      })
}


const editedStudentId = ref(null)
const originalStudent = ref(null)

function startEdit(student) {
  editedStudentId.value = student.id
  originalStudent.value = {...student}
}

function stopEdit(student) {
  const id = student.id;
  if (!originalStudent.value) return
  const changedFields = {}
  for (const key of Object.keys(student)) {
    if (
        key in originalStudent.value &&
        student[key] !== originalStudent.value[key] &&
        [
          'email', 'firstName', 'lastName', 'patronymic',
          'course', 'group', 'startYear', 'endYear',
          'supervisor', 'login', 'password'
        ].includes(key)
    ) {
      changedFields[key] = student[key]
    }
  }

  const supervisor = userList.value.find(user => user.id === student.supervisor);
  if (supervisor) {
    student.supervisorName = `${supervisor.lastName} ${supervisor.firstName[0]}.${supervisor.patronymic[0]}.`;
  }

  if (Object.keys(changedFields).length) {
    editStudent(id, changedFields);
  }

  editedStudentId.value = null
  originalStudent.value = null
}

async function editStudent(id, body) {
  await axios.put(`students/${id}`, body)
      .then((userData) => {
        getStudents()
      })
}

const studentsWithSupervisorName = computed(() => {
  return studentsList.value.map(student => {
    const supervisor = userList.value.find(user => user.id === student.supervisor)
    return {
      ...student,
      supervisorName: supervisor ? supervisor.fullName : '—',
    }
  })
})

const sortedData = computed(() => {
  const data = [...studentsWithSupervisorName.value]
  if (!sortKey.value) return data
  return data.sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const filteredData = computed(() => {
  return sortedData.value.filter(student =>
      student.email.toLowerCase().includes(emailSearch.value.toLowerCase())
  )
})

function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() =>
    Math.ceil(filteredData.value.length / pageSize)
)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

const deleteStudentDialogState = ref(false)
const studentToDelete = ref(null)

function confirmDeleteStudent(student) {
  studentToDelete.value = student
  deleteStudentDialogState.value = true
}

async function deleteStudent() {
  if (!studentToDelete.value) return
  await axios.delete(`students/${studentToDelete.value.id}`)
      .then(() => {
        deleteStudentDialogState.value = false
        studentToDelete.value = null
        getStudents()
      })
}
</script>

<style lang="scss">
@import "@/assets/styles/_variables.scss";


.custom-table {
  max-width: 1250px;
  width: 100%;
  overflow-x: auto;

  .email-search-wrapper {
    margin-bottom: 15px;
    display: flex;
  }

  .email-search-input {
    width: 100%;
    max-width: 250px;
    padding: 10px 15px;
    font-size: 14px;
    border: 1px solid $sc2;
    border-radius: 10px;
    background-color: white;
    transition: all 0.3s ease-in-out;

    &:focus {
      outline: none;
      border-color: $pr2;
      background-color: white;
    }

    &::placeholder {
      color: $sc2;
    }
  }

  .table-wrapper {
    width: 100%;
    overflow-x: auto;
  }

  table {
    table-layout: fixed;
    width: 100%;
    max-width: 1250px;
    border-collapse: collapse;
  }

  th, td {
    padding: 8px;
    border: 1px solid $sc2;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    input {
      width: 100%;
    }
  }

  .col-email {
    width: 180px;
  }

  .col-lastName,
  .col-firstName,
  .col-patronymic,
  .col-supervisorName {
    width: 120px;
  }

  .col-course,
  .col-group {
    width: 60px;
  }

  .col-deleteCol {
    width: 40px;
  }

  .col-startYear {
    width: 75px;
  }

  .col-endYear {
    width: 92px;
  }

  .col-login,
  .col-password {
    width: 120px;
  }

  th {
    cursor: pointer;
  }

  th:hover {
    background-color: $sc4;
  }

  .pagination {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  button {
    cursor: pointer;
  }
}

.delete-confirm-modal {
  padding: 20px;

  p {
    margin-bottom: 20px;
    font-size: 16px;
  }

  &__actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;

    button {
      padding: 8px 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      background: #fff;
    }
  }

  &__delete {
    background-color: #dc3545 !important;
    color: #fff;
    border-color: #dc3545 !important;

    &:hover {
      background-color: #c82333 !important;
    }
  }
}

</style>
