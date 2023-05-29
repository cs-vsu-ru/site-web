<script setup>
import {onMounted, ref, toRaw} from "vue";
import axios from "axios";
import Loader from "@/components/includes/Loader";

const example = ref()
const isLoading = ref(false)
const userRole = ref('')
const dialogState = ref()
const subjectName = ref()
const courseNGroups = ref()
const placement = ref()
const lessonId = ref()


onMounted( () => {
  checkRole()
  schedule()
})

const checkRole = async () => {
  await axios.get('account')
      .then((items) => {
        userRole.value = items.data.mainRole
      })
}


const schedule = async () => {
  isLoading.value = true

  await axios.get('parser/lessons/')
      .then((scheduleData) => {
        example.value = scheduleData.data
        isLoading.value = false
      })
}

const openModal = (name, courseName, place, id) => {
  dialogState.value = true
  subjectName.value = name
  courseNGroups.value = courseName
  placement.value = place
  lessonId.value = id
}

const saveSchedule = async () => {
  await axios.patch('parser/lessons/' + lessonId.value + '/', {
    groups: courseNGroups.value,
    placement: placement.value,
    name: subjectName.value
  })
}
</script>

<template>
  <section v-if="example" class="full-schedule">
    <h1>Расписание</h1>
    <div class="block-all">
      <table class="schedule__table sticky-table">
        <tr>
          <th style="background: white">День</th>
          <th style="background: white">Время</th>
          <th style="background: white; z-index: 2" v-for="name in example.employees">{{ name.name }}</th>
        </tr>
      </table>
      <table v-for="table in example.schedule" class="schedule__table cycle-table">
        <tr>
          <th rowspan="9" style="transform: rotate(-90deg)">
            {{ table.weekday }}
          </th>
        </tr>
        <tr v-for="time in table.times">
          <td>{{ time.time }}</td>
          <td v-for="(lesson, index) in time.lessons">
            <div class="outer-div" v-if="index === 'time'">
              <h4> {{ lesson }}</h4>
            </div>
            <div v-else class="outer-div">
              {{ lesson[0].name }} {{ lesson[0].groups }} {{ lesson[0].placement }}
              <button @click="openModal(lesson[0].name, lesson[0].groups, lesson[0].placement, lesson[0].id)" v-if="userRole === 'ROLE_ADMIN'" class="schedule-edit">
                <svg width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path> </g></svg>
              </button>
            </div>
            <div class="inner-div" v-if="index !== 'time'" v-show="userRole === 'ROLE_ADMIN' ||
              !(lesson[0].name === lesson[1].name
              && lesson[0].groups === lesson[1].groups
              && lesson[0].placement === lesson[1].placement)">
              {{ lesson[1].name }} {{ lesson[1].groups }} {{ lesson[1].placement }}
              <button @click="openModal(lesson[1].name, lesson[1].groups, lesson[1].placement, lesson[1].id)" v-if="userRole === 'ROLE_ADMIN'" class="schedule-edit">
                <svg width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path> </g></svg>
              </button>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <GDialog
        v-model="dialogState"
        :max-width="500"
        v-if="userRole === 'ROLE_ADMIN'"
    >
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
      </form>
    </GDialog>
  </section>
  <Loader v-if="isLoading"/>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.full-schedule{
  max-width: 1440px;
  margin: 0 auto;

  h1{
    margin-bottom: 30px;
  }

  td{
    width: 500px;
    height: 300px !important;
  }

  table{
    margin-top: unset;
    width: 1440px;

    &:nth-child(2){
      border-top: none;
    }

    &:not(:last-child) {
      border-bottom: none;
    }
  }
}
.cycle-table{
  &:first-child{
    border-top: none !important;
  }
}
.sticky-table{
  z-index: 2;
  position: sticky;
  top: 0;
  border-bottom: 3px solid $pr1 !important;
}
</style>