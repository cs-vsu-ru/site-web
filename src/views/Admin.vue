<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { API_FILES_URL, NO_IMG_URL, parserAxios } from '@/main';
import { GDialog } from 'gitart-vue-dialog/dist/index';
import Loader from '@/components/includes/Loader';
import { userAuth } from '@/store/userAuth';
import StudentsListTable from "@/views/StudentsListTable.vue";
import TabsConstructor from "@/views/TabsConstructor.vue";

const savedActiveItem = localStorage.getItem('activeItem');

const tabTitles = ref([])
const store = userAuth()
const slidesAdminArr = ref([])
const checkDisable = ref([])
const previewUrl = ref([])
const currFile = ref([])
const newSlide = ref(false)
const newText = ref('')
const addUrl = ref(null)
const newUrl = ref(null)
const newFile = ref(null)
const activeItem = ref(savedActiveItem ?? 'slider');
const newsSlider = ref([])
const newsDisabler = ref([])
const newsOriginalTitles = ref([])
const deleteNewsDialogState = ref(false)
const newsToDelete = ref(null)
const currNews = ref([])
const scheduleUrl = ref(null)
const scheduleError = ref('')
const weekConfigForm = ref({ reference_date: '', is_denominator: false })
const weekConfigLoaded = ref(false)
const weekConfigError = ref('')
const weekConfigSuccess = ref('')
const weekConfigSaving = ref(false)
const weekConfigEditing = ref(false)
const currentIsDenominator = ref(null)

const weekdayNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']

const formatReferenceDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
}

const referenceDateIsMonday = computed(() => {
  const v = weekConfigForm.value.reference_date
  if (!v) return null
  const d = new Date(v + 'T00:00:00')
  if (isNaN(d.getTime())) return false
  return d.getDay() === 1
})

const referenceDateWeekday = computed(() => {
  const v = weekConfigForm.value.reference_date
  if (!v) return ''
  const d = new Date(v + 'T00:00:00')
  if (isNaN(d.getTime())) return ''
  return weekdayNames[d.getDay()]
})

const toLocalISODate = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const shiftReferenceDateByWeek = (weeks) => {
  const v = weekConfigForm.value.reference_date
  if (!v) return
  const d = new Date(v + 'T00:00:00')
  if (isNaN(d.getTime())) return
  d.setDate(d.getDate() + weeks * 7)
  weekConfigForm.value.reference_date = toLocalISODate(d)
}
const userList = ref([])
const sortOption = ref('1');
const filterOption = ref('');
const employeesSearchQuery = ref('');
const activeEmployeesTab = ref(localStorage.getItem('employeesActiveTab') ?? 'employees');
const fileInput = ref(null);
const eventArr = ref([])
const monthAssoc = ref({
  '01': 'января',
  '02': 'февраля',
  '03': 'марта',
  '04': 'апреля',
  '05': 'мая',
  '06': 'июня',
  '07': 'июля',
  '08': 'августа',
  '09': 'сентября',
  '10': 'октября',
  '11': 'ноября',
  '12': 'декабря'
})
const isLoading = ref(false)
const mails = ref()
const newsShow = ref([])
const eventsShow = ref([])
const assocStatus = ref({
  'open': 'Запланирована',
  'close': 'Отправлена'
})
const newsUrl = ref()
const admRole = ref()

const uniquePosts = computed(() => {
  const posts = userList.value.map(user => user.post);
  return [...new Set(posts)].filter(post => post);
});

const filteredAndSortedUsers = computed(() => {
  let users = [...userList.value];

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

const handleEmployeesActiveTabChange = (tab) => {
  localStorage.setItem('employeesActiveTab', tab);
  activeEmployeesTab.value = tab;
}

onMounted(() => {
  getSlidesForAdmin()
  newsList()
  getUsers()
  eventList()
  getMails()
  checkRole()
  loadWeekConfig()

  tabsHandler(activeItem.value);
})

const checkRole = async () => {
  admRole.value = store.getRole

  let buttons = [
    { value: 'navigation', label: 'Навигация' },
    { value: 'slider', label: 'Слайдер' },
    { value: 'events', label: 'Мероприятия' },
    { value: 'feed', label: 'Новости' },
    { value: 'schedule', label: 'Расписание' },
    { value: 'employees', label: 'Сотрудники' },
    { value: 'students', label: 'Студенты' },
    { value: 'newsletter', label: 'Рассылка' }
  ]

  if (admRole.value === 'ADMIN') {
    tabTitles.value = buttons
  }

  if (admRole.value === 'MODERATOR') {
    tabTitles.value = buttons.filter(b => b.value !== 'employees');
  }
}

const eventList = async () => {
  await axios.get('events')
      .then((events) => {
        eventArr.value = events.data

        for (let i = 0; i < events.data.length; i++) {
          eventsShow.value.push(true)
        }
      })
}

const formatDateToString = (eventDate) => {
  const dateObject = new Date(eventDate);
  return `${dateObject.getDate().toString().padStart(2, '0')}.${(
      dateObject.getMonth() + 1
  )
      .toString()
      .padStart(2, '0')}.${dateObject.getFullYear()}`;
}

const formatTimeToString = (eventDate) => {
  const dateObject = new Date(eventDate);
  return `${dateObject
      .getHours()
      .toString()
      .padStart(2, '0')}:${dateObject
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

}

const getSlidesForAdmin = async () => {
  await axios.get('sliders')
      .then((slidesData) => {
        slidesAdminArr.value = slidesData.data

        for (let i in slidesData.data) {
          checkDisable.value.push(true)
          currFile.value.push(null)
        }
      })
}

const saveChanges = async (slideId, imageURL, title, urlTo, slideIdx) => {
  if (previewUrl.value[slideIdx].files[0]) {
    let formData = new FormData()

    formData.append('file', previewUrl.value[slideIdx].files[0])

    await axios.post('upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(async (urlData) => {
          await axios.put('sliders/' + slideId, {
            id: slideId,
            imageURL: urlData.data,
            title: title,
            urlTo: urlTo
          })
        })
  } else {
    await axios.put('sliders/' + slideId, {
      id: slideId,
      imageURL: imageURL,
      title: title,
      urlTo: urlTo
    })
  }
}

const checkFile = (currId) => {
  currFile.value[currId] = URL.createObjectURL(previewUrl.value[currId].files[0])
}

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

    await getUsers();

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

const addSlide = async () => {
  if (addUrl.value.files[0]) {
    let formData = new FormData()

    formData.append('file', addUrl.value.files[0])

    await axios.post('upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(async (urlData) => {
          await axios.post('sliders', {
            imageURL: urlData.data,
            title: newText.value,
            urlTo: newsUrl.value
          })

          location.reload()
        })
  } else {
    await axios.post('sliders', {
      imageURL: `${NO_IMG_URL}`,
      title: newText.value,
      urlTo: newsUrl.value
    })
        .then(() => {
          location.reload()
        })
  }
}

const checkNewFile = () => {
  newFile.value = URL.createObjectURL(addUrl.value.files[0])
}

const deleteSlide = async (slideId) => {
  await axios.delete('sliders/' + slideId)
      .then(() => {
        location.reload()
      })
}

const tabsHandler = (tab) => {
  localStorage.setItem('activeItem', tab);
  activeItem.value = tab;
}

const newsList = async () => {
  await axios.get('news')
      .then((news) => {
        newsSlider.value = news.data
        newsSlider.value.reverse()

        for (let i in news.data) {
          newsDisabler.value.push(false)
          currNews.value.push(null)
          newsShow.value.push(true)
          newsOriginalTitles.value.push('')
        }
      })
}

const checkNew = (currId) => {
  currNews.value[currId] = URL.createObjectURL(newUrl.value[currId].files[0])
}

const startEditNews = (index, title) => {
  newsOriginalTitles.value[index] = title
  newsDisabler.value[index] = true
}

const cancelEditNews = (index) => {
  newsSlider.value[index].title = newsOriginalTitles.value[index]
  currNews.value[index] = null
  if (newUrl.value && newUrl.value[index]) {
    newUrl.value[index].value = ''
  }
  newsDisabler.value[index] = false
}

const saveNews = async (artId, pubDate, pubTime, content, title, imageURL, slideIdx) => {
  if (newUrl.value[slideIdx].files[0]) {
    let formData = new FormData()

    formData.append('file', newUrl.value[slideIdx].files[0])

    await axios.post('upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(async (urlData) => {
          await axios.put('news/' + artId, {
            id: artId,
            content: content,
            title: title,
            imageLink: urlData.data
          })
        })
  } else {
    await axios.put('news/' + artId, {
      id: artId,
      content: content,
      title: title,
      imageLink: imageURL
    })
  }
}

const requestDeleteNews = (newsSlide, index) => {
  newsToDelete.value = { id: newsSlide.id, title: newsSlide.title, index }
  deleteNewsDialogState.value = true
}

const confirmDeleteNews = async () => {
  if (!newsToDelete.value) return
  const { id, index } = newsToDelete.value
  deleteNewsDialogState.value = false
  await deleteNews(id, index)
  newsToDelete.value = null
}

const deleteNews = async (artId, index) => {
  await axios.delete('news/' + artId)
      .then(() => {
        newsShow.value[index] = false
      })
}

const loadWeekConfig = async () => {
  try {
    const response = await parserAxios.get('lessons/week_config/')
    weekConfigForm.value = {
      reference_date: response.data.reference_date ?? '',
      is_denominator: Boolean(response.data.is_denominator)
    }
    currentIsDenominator.value = response.data.current_is_denominator ?? null
    weekConfigLoaded.value = true
  } catch (err) {
    weekConfigError.value = 'Не удалось загрузить настройку чередования недель'
  }
}

const cancelWeekConfigEdit = () => {
  weekConfigEditing.value = false
  weekConfigError.value = ''
  loadWeekConfig()
}

const isMondayISO = (dateStr) => {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T00:00:00')
  return !isNaN(d.getTime()) && d.getDay() === 1
}

const saveWeekConfig = async () => {
  weekConfigError.value = ''
  weekConfigSuccess.value = ''

  if (!weekConfigForm.value.reference_date) {
    weekConfigError.value = 'Укажите опорную дату'
    return
  }
  if (!isMondayISO(weekConfigForm.value.reference_date)) {
    weekConfigError.value = 'Опорная дата должна быть понедельником'
    return
  }

  weekConfigSaving.value = true
  try {
    await parserAxios.patch('lessons/week_config/', {
      reference_date: weekConfigForm.value.reference_date,
      is_denominator: weekConfigForm.value.is_denominator
    })
    weekConfigSuccess.value = 'Настройка сохранена'
    setTimeout(() => { weekConfigSuccess.value = '' }, 3000)
    weekConfigEditing.value = false
    await loadWeekConfig()
  } catch (err) {
    const status = err.response?.status
    if (status === 400) {
      weekConfigError.value = 'Некорректные данные. Проверьте опорную дату'
    } else {
      weekConfigError.value = 'Не удалось сохранить настройку'
    }
  } finally {
    weekConfigSaving.value = false
  }
}

const uploadSchedule = async () => {
  scheduleError.value = ''

  if (!scheduleUrl.value?.files?.length) {
    scheduleError.value = 'Выберите файл для загрузки'
    return
  }

  let formData = new FormData()
  isLoading.value = true

  formData.append('file', scheduleUrl.value.files[0])

  try {
    const response = await parserAxios.post('lessons/parse/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

    if (response.data?.errors?.length) {
      sessionStorage.setItem('scheduleParseErrors', JSON.stringify(response.data.errors))
    }

    location.replace('/is/full-schedule')
  } catch (err) {
    const status = err.response?.status
    const errorType = err.response?.data?.error?.type

    if (status === 400) {
      scheduleError.value = 'Файл не передан или имеет неверный формат'
    } else if (status === 500 || errorType === 'critical_error') {
      scheduleError.value = 'Не удалось обработать файл. Убедитесь, что загружаемый файл — корректный .xlsx'
    } else {
      scheduleError.value = 'Произошла ошибка при загрузке расписания'
    }
  } finally {
    isLoading.value = false
  }
}

const getUsers = async () => {
  await axios.get('employees')
      .then((userData) => {
        userList.value = userData.data
      })
}

const deleteUserDialogState = ref(false)
const userToDelete = ref(null)

const confirmDeleteUser = (user) => {
  userToDelete.value = user
  deleteUserDialogState.value = true
}

const deleteUser = async () => {
  if (!userToDelete.value) return
  await axios.delete('employees/' + userToDelete.value.id)
      .then(() => {
        deleteUserDialogState.value = false
        userToDelete.value = null
        location.reload()
      })
}

const getMails = async () => {
  await axios.get('newsletters')
      .then((mailsData) => {
        mails.value = mailsData.data
      })
}

const deleteEvent = async (eventId, index) => {
  await axios.delete('events/' + eventId)
      .then(() => {
        eventsShow.value[index] = false
      })
}

const deleteMail = async (mailId) => {
  await axios.delete('newsletter/' + mailId)
      .then(() => {
        location.reload()
      })
}
</script>

<template>
  <section class="admin">
    <aside class="admin__tabs">
      <button
          @click="activeItem = value; tabsHandler(value)"
          :class="{active: value === activeItem}"
          v-for="({ value, label }) in tabTitles"
          class="admin__tabs-item admin-button"
          :key="value"
      >
        {{ label }}
      </button>
    </aside>
    <div class="admin__view">
      <div v-show="activeItem === 'navigation'" class="admin__view-item">
        <TabsConstructor />
      </div>
      <div v-show="activeItem === 'slider'" class="admin__view-item">
        <div class="slider-admin">
          <div v-for="(slide, index) in slidesAdminArr" :key="slide.id" class="slider-admin__item">
            <div class="slider-admin__box">
              <img v-if="currFile[index] === null" :src="`${API_FILES_URL}/${slide.imageURL}`" alt="" class="slider-admin__item-img">
              <img v-else :src="`${API_FILES_URL}/${currFile[index]}`" alt="" class="slider-admin__item-img">
              <input v-on:change="checkFile(index)" ref="previewUrl" :id="slide.id" type="file"
                     accept="image/png, image/jpeg, image/jpg" class="slider-admin__box-input">
              <label v-if="!checkDisable[index]" class="slider-admin__box-label" :for="slide.id"></label>
              <svg v-if="!checkDisable[index]" width="64px" height="64px" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" style="stroke-width:0"></g>
                <g id="SVGRepo_tracerCarrier" style="stroke-linecap:round;stroke-linejoin:round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path>
                </g>
              </svg>
            </div>
            <div style="display: flex;flex-direction: column; justify-content: space-between; gap: 10px; width: 50%">
              <textarea v-model="slide.title" class="slider-admin__item-text"
                        :disabled="checkDisable[index]"></textarea>
              <input :disabled="checkDisable[index]" type="text" class="slider-admin__item-text" v-model="slide.urlTo">
            </div>
            <div class="slider-admin__item-buttons">
              <svg @click="checkDisable[index] = false" width="64px" height="64px" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" style="stroke-width:0"></g>
                <g id="SVGRepo_tracerCarrier" style="stroke-linecap:round;stroke-linejoin:round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path>
                </g>
              </svg>
              <svg @click="deleteSlide(slide.id)" width="64px" height="64px" viewBox="0 -0.5 21 21"
                   xmlns="http://www.w3.org/2000/svg" style="fill:#000000">
                <g id="SVGRepo_bgCarrier" style="stroke-width:0"></g>
                <g id="SVGRepo_tracerCarrier" style="stroke-linecap:round;stroke-linejoin:round"></g>
                <g id="SVGRepo_iconCarrier"><title>delete [#1487]</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g id="Page-1" style="stroke:none;stroke-width:1;fill:none;fill-rule:evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" style="fill:#00295F">
                      <g id="icons" transform="translate(56.000000, 160.000000)">
                        <path
                            d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z"
                            id="delete-[#1487]"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <button
                @click="saveChanges(slide.id, currFile[index] || slide.imageURL, slide.title, slide.urlTo, index); checkDisable[index] = true"
                v-if="!checkDisable[index]" class="slider-admin__item-save admin-button">Сохранить
            </button>
          </div>
          <div v-if="newSlide" class="slider-admin__item">
            <div class="slider-admin__box">
              <div v-if="newFile === null" class="slider-admin__item-img"></div>
              <img v-else :src="`${newFile}`" alt="" class="slider-admin__item-img">
              <input v-on:change="checkNewFile" ref="addUrl" id="new-slide" type="file"
                     accept="image/png, image/jpeg, image/jpg" class="slider-admin__box-input">
              <label for="new-slide" class="slider-admin__box-label"></label>
              <svg width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" style="stroke-width:0"></g>
                <g id="SVGRepo_tracerCarrier" style="stroke-linecap:round;stroke-linejoin:round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path>
                </g>
              </svg>
            </div>
            <div style="display: flex;flex-direction: column; justify-content: space-between; gap: 10px; width: 50%">
              <textarea v-model="newText" class="slider-admin__item-text"
                        placeholder="Введите текст для слайда"></textarea>
              <input v-model="newsUrl" type="text" class="slider-admin__item-text" placeholder="Введите ссылку">
            </div>
            <button @click="addSlide" class="slider-admin__item-save admin-button">Сохранить</button>
          </div>
          <button @click="newSlide = true" class="slider-admin__add admin-button">Добавить слайд</button>
        </div>
      </div>
      <div v-show="activeItem === 'events'" class="admin__view-item">
        <div style="display:flex;">
          <div class="admin-event">
            <div class="admin-event__field" v-for="(event, index) in eventArr" v-show="eventsShow[index]">
              <router-link :to="'/events/' + event.id" class="event">
                <div class="event__date">
                  <p class="event__date-day">{{ formatDateToString(event.startDateTime) }}</p>
                  <p class="event__date-time">{{ formatTimeToString(event.startDateTime) }}</p>
                </div>
                <p class="event__name">{{ event.title }}</p>
              </router-link>
              <svg style="margin-left: 20px; cursor:pointer; fill:#000000" @click="deleteEvent(event.id, index)" width="32" height="32"
                   viewBox="0 -0.5 21 21" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" style="stroke-width:0"></g>
                <g id="SVGRepo_tracerCarrier" style="stroke-linecap:round;stroke-linejoin:round"></g>
                <g id="SVGRepo_iconCarrier"><title>delete [#1487]</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g id="Page-1" style="stroke:none;stroke-width:1;fill:none;fill-rule:evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" style="fill:#00295F">
                      <g id="icons" transform="translate(56.000000, 160.000000)">
                        <path
                            d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z"
                            id="delete-[#1487]"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <router-link to="/create-event" style="align-self: flex-start; flex-shrink: 0" class="admin-button">Создать мероприятие</router-link>
        </div>
      </div>
      <div v-show="activeItem === 'feed'" class="admin__view-item">
        <router-link to="/admin/create_news" class="admin-button news-create-btn">
          <svg class="news-create-btn__icon" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Создать новость
        </router-link>
        <div class="news-grid">
          <article v-for="(newsSlide, index) in newsSlider"
                   :key="newsSlide.id"
                   class="news-card"
                   :class="{ 'news-card--editing': newsDisabler[index] }"
                   v-show="newsShow[index]">
            <div class="news-card__cover">
              <img v-if="currNews[index] === null"
                   :src="`${API_FILES_URL}/${newsSlide.imageLink}`"
                   alt=""
                   class="news-card__cover-img">
              <img v-else
                   :src="`${API_FILES_URL}/${currNews[index]}`"
                   alt=""
                   class="news-card__cover-img">
              <input ref="newUrl"
                     :id="newsSlide.id"
                     type="file"
                     accept="image/png, image/jpeg, image/jpg"
                     class="news-card__cover-input"
                     @change="checkNew(index)">
              <label v-if="newsDisabler[index]" :for="newsSlide.id" class="news-card__cover-overlay">
                <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                <span>Изменить обложку</span>
              </label>
            </div>
            <div class="news-card__body">
              <p class="news-card__date">
                {{ new Date(newsSlide.publicationAt).getDate() + ' ' + monthAssoc[newsSlide.publicationAt.split('-').reverse()[1]] }}
              </p>
              <textarea maxlength="110"
                        v-model="newsSlide.title"
                        class="news-card__title"
                        :disabled="!newsDisabler[index]"
                        rows="3"></textarea>
              <div class="news-card__footer">
                <div class="news-card__actions">
                  <button type="button"
                          class="news-card__icon-btn"
                          title="Редактировать"
                          aria-label="Редактировать"
                          @click="startEditNews(index, newsSlide.title)">
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button type="button"
                          class="news-card__icon-btn news-card__icon-btn--danger"
                          title="Удалить"
                          aria-label="Удалить"
                          @click="requestDeleteNews(newsSlide, index)">
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                  <router-link :to="'/news/new/' + newsSlide.id"
                               class="news-card__icon-btn"
                               title="Открыть страницу"
                               aria-label="Открыть страницу">
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill="currentColor" d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7zM19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/>
                    </svg>
                  </router-link>
                </div>
                <div v-if="newsDisabler[index]" class="news-card__edit-actions">
                  <button type="button"
                          class="news-card__cancel"
                          @click="cancelEditNews(index)">
                    Отмена
                  </button>
                  <button type="button"
                          class="admin-button news-card__save"
                          @click="saveNews(newsSlide.id, newsSlide.publicationDate, newsSlide.publicationTime, newsSlide.content, newsSlide.title, newsSlide.imageLink, index); newsDisabler[index] = false">
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
      <div v-show="activeItem === 'schedule'" class="admin__view-item">
        <div class="admin-schedule">
          <input ref="scheduleUrl" type="file" accept=".xlsx">
          <button @click="uploadSchedule" class="admin-button">Загрузить</button>
        </div>
        <div v-if="scheduleError" class="schedule-error">
          {{ scheduleError }}
        </div>
        <div v-if="weekConfigLoaded" class="week-config">
          <div class="week-config__summary" v-if="!weekConfigEditing">
            <span>
              Сейчас идёт <b>{{ currentIsDenominator ? 'знаменатель' : 'числитель' }}</b>.
              Опорная неделя — {{ formatReferenceDate(weekConfigForm.reference_date) }}
              ({{ weekConfigForm.is_denominator ? 'знаменатель' : 'числитель' }}).
            </span>
            <button class="week-config__link" @click="weekConfigEditing = true">Изменить</button>
          </div>

          <div class="week-config__editor" v-else>
            <div class="week-config__row">
              <label class="week-config__field">
                <span>Опорный понедельник</span>
                <input type="date" v-model="weekConfigForm.reference_date">
                <span v-if="weekConfigForm.reference_date && referenceDateIsMonday === false"
                      class="week-config__inline-hint">
                  выбранная дата — {{ referenceDateWeekday }}, нужен понедельник
                </span>
              </label>
              <button type="button"
                      class="week-config__shift"
                      :disabled="!weekConfigForm.reference_date"
                      @click="shiftReferenceDateByWeek(1)">
                +1 неделя
              </button>
              <button type="button"
                      class="week-config__shift"
                      :disabled="!weekConfigForm.reference_date"
                      @click="shiftReferenceDateByWeek(-1)">
                −1 неделя
              </button>
            </div>

            <div class="week-config__row">
              <div class="week-config__toggle" role="radiogroup" aria-label="Тип опорной недели">
                <button type="button"
                        role="radio"
                        :aria-checked="!weekConfigForm.is_denominator"
                        :class="{ active: !weekConfigForm.is_denominator }"
                        @click="weekConfigForm.is_denominator = false">
                  Числитель
                </button>
                <button type="button"
                        role="radio"
                        :aria-checked="weekConfigForm.is_denominator"
                        :class="{ active: weekConfigForm.is_denominator }"
                        @click="weekConfigForm.is_denominator = true">
                  Знаменатель
                </button>
              </div>
            </div>

            <div class="week-config__actions">
              <button @click="saveWeekConfig"
                      :disabled="weekConfigSaving || referenceDateIsMonday === false"
                      class="admin-button">
                {{ weekConfigSaving ? 'Сохранение…' : 'Сохранить' }}
              </button>
              <button type="button"
                      class="week-config__link"
                      :disabled="weekConfigSaving"
                      @click="cancelWeekConfigEdit">
                Отмена
              </button>
            </div>
          </div>

          <div v-if="weekConfigError" class="schedule-error">{{ weekConfigError }}</div>
          <div v-if="weekConfigSuccess" class="week-config__success">{{ weekConfigSuccess }}</div>
        </div>
      </div>
      <div v-show="admRole === 'ADMIN' && activeItem === 'employees'" class="admin__view-item">
        <div class="admin-users">
          <div class="admin-users__item">
            <div class="admin-users__item-head">
              <div style="display: flex; gap: 5px">
                <p
                    @click="handleEmployeesActiveTabChange('employees')"
                    :class="['admin-users__item-head_name', 'employees-tab-button', activeEmployeesTab === 'employees' ? 'active' : '']"
                >
                  Сотрудники
                </p>
                <p class="admin-users__item-head_name">/</p>
                <p
                    @click="handleEmployeesActiveTabChange('personalPlan')"
                    :class="['admin-users__item-head_name', 'employees-tab-button', activeEmployeesTab === 'personalPlan' ? 'active' : '']"
                >
                  Индивидуальный план
                </p>
              </div>
              <router-link to="/admin/create_user" class="admin-button">Добавить</router-link>
            </div>

            <div style="display: flex; gap: 10px">
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
            <div class="admin-users__item-list">
              <div v-for="user in filteredAndSortedUsers" class="user-item">
                <p class="user-item__name">{{ user.lastName + ' ' + user.firstName + ' ' + user.patronymic }}</p>
                <template v-if="activeEmployeesTab === 'employees'">
                  <router-link :to="'/profile/' + user.id" style="margin-left: auto;" class="admin-button">Редактировать
                  </router-link>
                  <button @click="confirmDeleteUser(user)" class="admin-button">Удалить</button>
                </template>
                <div v-else style="display: flex; gap: 15px">
                  <a
                      v-if="user.plan"
                      :href="`${API_FILES_URL}/${user.plan}`"
                      class="download-button admin-button"
                      target="_blank"
                  >
                    Скачать текущий план
                  </a>
                  <button class="upload-button admin-button">
                    Загрузить план
                    <input
                        type="file"
                        ref="fileInput"
                        @change="handleFileUpload($event, user)"
                        accept=".pdf"
                        class="file-input"
                    >
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="admin__view-item" v-show="activeItem === 'students'">
        <div class="admin-users">
          <div class="admin-users__item">
            <div class="admin-users__item-head">
              <p class="admin-users__item-head_name">Студенты</p>
              <router-link to="/admin/create_student" class="admin-button">Добавить</router-link>
            </div>
            <div class="admin-users__item-list">
              <StudentsListTable/>
            </div>
          </div>
        </div>
      </div>
      <div v-show="activeItem === 'newsletter'" class="admin__view-item">
        <router-link to="/create-mail" class="mails-button admin-button">Создать рассылку</router-link>
        <table class="mails">
          <thead>
          <tr>
            <th>Тема</th>
            <th>Получатели</th>
            <th>Дата отправки</th>
            <th>Статус</th>
            <th>Действие</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="mail in mails">
            <td>{{ mail.subject }}</td>
            <td>
              <p v-for="way in mail.emails">
                {{ way.email }}
              </p>
            </td>
            <td>{{ mail.newsletterDate.split('T')[0].split('-').reverse().join('.') }}</td>
            <td>{{ assocStatus[mail.status] }}</td>
            <td>
              <div class="mail-moves">
                <router-link :to="'/edit-mail/' + mail.id">
                  <svg data-v-54c38a05="" style="margin-right: 10px;" width="32" height="32" viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg">
                    <g data-v-54c38a05="" id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g data-v-54c38a05="" id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g data-v-54c38a05="" id="SVGRepo_iconCarrier">
                      <path data-v-54c38a05="" fill-rule="evenodd" clip-rule="evenodd"
                            d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path>
                    </g>
                  </svg>
                </router-link>
                <svg @click="deleteMail(mail.id)" width="32" height="32" viewBox="0 -0.5 21 21"
                     xmlns="http://www.w3.org/2000/svg" style="fill:#000000">
                  <g id="SVGRepo_bgCarrier" style="stroke-width:0"></g>
                  <g id="SVGRepo_tracerCarrier" style="stroke-linecap:round;stroke-linejoin:round"></g>
                  <g id="SVGRepo_iconCarrier"><title>delete [#1487]</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g id="Page-1" style="stroke:none;stroke-width:1;fill:none;fill-rule:evenodd">
                      <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" style="fill:#00295F">
                        <g id="icons" transform="translate(56.000000, 160.000000)">
                          <path
                              d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z"
                              id="delete-[#1487]"></path>
                    </g>
                  </g>
                </g>
                  </g>
                </svg>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <GDialog v-model="deleteUserDialogState" :max-width="400">
    <div class="delete-confirm-modal">
      <p>Вы уверены, что хотите удалить сотрудника
        <strong>{{ userToDelete?.lastName }} {{ userToDelete?.firstName }} {{ userToDelete?.patronymic }}</strong>?
      </p>
      <div class="delete-confirm-modal__actions">
        <button @click="deleteUser" class="admin-button delete-confirm-modal__delete">Удалить</button>
        <button @click="deleteUserDialogState = false" class="admin-button">Отмена</button>
      </div>
    </div>
  </GDialog>

  <GDialog v-model="deleteNewsDialogState" :max-width="420">
    <div class="delete-confirm-modal">
      <p>Удалить новость
        <strong v-if="newsToDelete?.title">«{{ newsToDelete.title }}»</strong><span v-else>без заголовка</span>?
      </p>
      <div class="delete-confirm-modal__actions">
        <button @click="confirmDeleteNews" class="admin-button delete-confirm-modal__delete">Удалить</button>
        <button @click="deleteNewsDialogState = false" class="admin-button">Отмена</button>
      </div>
    </div>
  </GDialog>

  <Loader v-if="isLoading"/>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.mail-moves {
  svg {
    cursor: pointer;

    &:first-child:hover {
      fill: lightgreen;
    }

    &:last-child {
      path {
        transition: 0.2s;
      }

      &:hover path {
        fill: crimson;
      }
    }
  }
}

.admin {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 50px;

  @media (max-width: 1480px) {
    max-width: calc(100% - 40px);
  }

  &__tabs {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    flex-direction: column;

    &-item {
      width: 250px;
    }
  }

  &__view {
    width: 100%;

    &-item {
      position: relative;

      &.active {
        display: flex;
      }
    }

  }
}

.news-create-btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  &__icon {
    flex-shrink: 0;
  }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
  gap: 20px;
  width: 100%;
}

.news-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 1px solid $sc3;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.15s ease, border-color 0.15s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &--editing {
    border-color: $pr1;
  }

  &__cover {
    position: relative;
    flex-shrink: 0;
    width: 200px;
    height: 130px;
    border-radius: 10px;
    overflow: hidden;
    background: $sc3;
  }

  &__cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__cover-input {
    display: none;
  }

  &__cover-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: rgba($pr1, 0.6);
    color: white;
    font-size: 13px;
    line-height: 16px;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: rgba($pr1, 0.75);
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__date {
    font-size: 13px;
    line-height: 16px;
    color: $sc5;
    margin: 0;
  }

  &__title {
    font-size: 16px;
    line-height: 22px;
    color: $pr1;
    background: white;
    border: 1px solid $sc2;
    border-radius: 8px;
    padding: 8px 10px;
    resize: none;
    font-family: inherit;
    transition: border-color 0.15s ease;

    &:focus {
      outline: none;
      border-color: $pr1;
    }

    &:disabled {
      border-color: transparent;
      background: transparent;
      color: $pr1;
      cursor: default;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: auto;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__icon-btn {
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    color: $pr1;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

    &:hover {
      background: $pr3;
      border-color: $pr1;
    }

    &--danger:hover {
      color: crimson;
      background: rgba(220, 20, 60, 0.08);
      border-color: currentColor;
    }
  }

  &__edit-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__save {
    padding: 6px 16px;
    font-size: 14px;
    line-height: 18px;
  }

  &__cancel {
    padding: 6px 14px;
    font-size: 14px;
    line-height: 18px;
    color: $sc5;
    background: transparent;
    border: 1px solid $sc2;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

    &:hover {
      background: $sc3;
      color: $pr1;
      border-color: $pr1;
    }
  }
}

.employees-tab-button {
  cursor: pointer;

  &:not(.active) {
    color: gray;
  }
}

.employees-search-input {
  background-color: unset;
  color: $pr1
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

.slider-admin {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    position: relative;

    &-img {
      width: 300px;
      height: 150px;
      object-fit: cover;
    }

    &-text {
      font-size: 20px;
      line-height: 24px;
      width: 100%;
      resize: none;
      border: 2px solid $pr1;
      border-radius: 10px;
      padding: 5px;

      &:disabled {
        border: none;
      }
    }

    &-buttons {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      align-self: center;

      & svg {
        width: 30px;
        fill: $pr1;
        cursor: pointer;
      }
    }

    &-save {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  &__add {
    align-self: center;
    width: 300px;
    margin-top: 20px;
  }
}

.slider-admin__box {
  width: 300px;
  height: 150px;
  position: relative;

  &-input {
    display: none;
  }

  &-label {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    cursor: pointer;
    z-index: 1;

    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: $pr1;
      opacity: 0.3;
      z-index: -1;
    }
  }

  & svg {
    fill: $pr3;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}

.admin-schedule {
  display: flex;
  align-items: center;
  gap: 10px;
}

.schedule-error {
  margin-top: 10px;
  padding: 12px 16px;
  background-color: #fdecea;
  color: #b71c1c;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  font-size: 14px;
}

.week-config {
  margin-top: 20px;
  max-width: 720px;
  font-size: 14px;

  &__summary {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    color: #333;
  }

  &__link {
    background: none;
    border: none;
    color: #00295F;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-size: 14px;

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }

  &__editor {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 4px;
  }

  &__row {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 4px;

    input[type="date"] {
      padding: 6px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }
  }

  &__inline-hint {
    color: #b71c1c;
    font-size: 12px;
  }

  &__shift {
    padding: 6px 10px;
    border: 1px solid #ccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;

    &:hover:not(:disabled) {
      border-color: #00295F;
      color: #00295F;
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }

  &__toggle {
    display: inline-flex;
    border: 1px solid #ccc;
    border-radius: 6px;
    overflow: hidden;

    button {
      padding: 6px 14px;
      background: white;
      border: none;
      cursor: pointer;
      font-size: 13px;
      transition: background-color 0.2s, color 0.2s;

      & + button {
        border-left: 1px solid #ccc;
      }

      &.active {
        background-color: #00295F;
        color: white;
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__success {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
    border-radius: 6px;
  }
}

.admin-users {
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;

  &__item {
    background: $pr3;
    border-radius: 10px;
    padding: 15px 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;

    &-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid $pr2;
      padding-bottom: 15px;

      &_name {
        font-size: 30px;
        line-height: 35px;
        color: $pr1;
      }
    }

    &-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }
}

select option {
  background: #fff !important;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 13px 18px;
  border-radius: 10px;
  gap: 15px;

  &__name {
    font-size: 22px;
    line-height: 25px;
  }
}

.mails {
  width: 100%;
  background: $pr3;
  border-radius: 10px;
  border-spacing: 20px;
  margin-top: 20px;

  th {
    font-size: 24px;
    line-height: 28px;
    font-weight: 400;
    color: $pr1;
    letter-spacing: 0.015em;
    padding: 6px 0;
  }

  tbody tr {
    margin-bottom: 10px;
    background: white;

    td {
      text-align: center;
      font-size: 18px;
      line-height: 21px;
      letter-spacing: 0.015em;
    }
  }
}

.mails-button {
  justify-self: flex-end;
}

.admin-event {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  &__field {
    display: flex;
    align-items: center;
    width: 100%;

    .event {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 25px;

      &__date {
        display: flex;
        align-items: center;
        gap: 10px;

        &-day, &-time {
          font-weight: 700;
        }
      }

      &__name {
        font-weight: 700;
        font-size: 20px;
        max-width: 500px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
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
  }

  &__delete {
    background-color: #dc3545;
    color: #fff;

    &:hover {
      background-color: #c82333;
    }
  }
}

</style>
