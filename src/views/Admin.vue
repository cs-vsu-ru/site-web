<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import index from "vuex";
import Loader from "@/components/includes/Loader";

const tabTitles = ['Слайдер', 'Мероприятия', 'Новости', 'Расписание', 'Пользователи', 'Рассылка']

const slidesAdminArr = ref([])
const checkDisable = ref([])
const previewUrl = ref([])
const currFile = ref([])
const newSlide = ref(false)
const newText = ref('')
const addUrl = ref(null)
const newUrl = ref(null)
const newFile = ref(null)
const activeItem = ref(0)
const newsSlider = ref([])
const newsDisabler = ref([])
const currNews = ref([])
const scheduleUrl = ref(null)
const userList = ref([])
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
  'open': 'Открыта'
})

onMounted(() => {
    getSlidesForAdmin()
    newsList()
    getUsers()
    eventList()
    getMails()
})

const eventList = async () => {
  await axios.get('events')
      .then((events) => {
        eventArr.value = events.data

        for (let i = 0; i < events.data.length; i++) {
          eventsShow.value.push(true)
        }
      })
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

        await axios.post('uploadFile',
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
    }
    else {
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

const addSlide = async () => {
    let formData = new FormData()

    formData.append('file', addUrl.value.files[0])

    await axios.post('uploadFile',
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
                urlTo: 'https://www.vsu.ru/'
            })

            location.reload()
        })
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

const tabsHandler = (tabIndex) => {
    let tabView = document.querySelectorAll('.admin__view-item')

    for (let i = 0; i < tabView.length; i++) {
        tabView[i].classList.remove('active')
    }

    tabView[tabIndex].classList.add('active')
}

const newsList = async () => {
    await axios.get('articles')
        .then((news) => {
            newsSlider.value = news.data
            newsSlider.value.reverse()

            for (let i in news.data) {
                newsDisabler.value.push(false)
                currNews.value.push(null)
                newsShow.value.push(true)
            }
        })
}

const checkNew = (currId) => {
    currNews.value[currId] = URL.createObjectURL(newUrl.value[currId].files[0])
}

const saveNews = async (artId, pubDate, pubTime, content, title, imageURL, slideIdx) => {
    if (newUrl.value[slideIdx].files[0]) {
        let formData = new FormData()

        formData.append('file', newUrl.value[slideIdx].files[0])

        await axios.post('uploadFile',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(async (urlData) => {
                await axios.put('articles/' + artId, {
                    id: artId,
                    publicationDate: pubDate,
                    publicationTime: pubTime,
                    content: content,
                    title: title,
                    imageURL: urlData.data
                })
            })
    }
    else {
        await axios.put('articles/' + artId, {
            id: artId,
            publicationDate: pubDate,
            publicationTime: pubTime,
            content: content,
            title: title,
            imageURL: imageURL
        })
    }
}

const deleteNews = async (artId, index) => {
    await axios.delete('articles/' + artId)
        .then(() => {
          newsShow.value[index] = false
        })
}

const uploadSchedule = async () => {
    let formData = new FormData()
    isLoading.value = true

    formData.append('file', scheduleUrl.value.files[0])

    await axios.post('uploadFile',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(async (schData) => {
            let parseData = new FormData()

            parseData.append('filepath', schData.data)

            await axios.post('parseTimetable', parseData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(() => {
                  isLoading.value = false
                })
        })
}

const getUsers = async () => {
    await axios.get('employees')
        .then((userData) => {
            userList.value = userData.data
        })
}

const deleteUser = async (userId) => {
  await axios.delete('employees/' + userId)
      .then(() => {
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
</script>

<template>
  <section class="admin">
    <aside class="admin__tabs">
      <button
          @click="activeItem = idx; tabsHandler(idx)"
          :class="{active: idx === activeItem}"
          v-for="(tab, idx) in tabTitles"
          class="admin__tabs-item admin-button"
          :key="idx"
      >
          {{ tab }}
      </button>
    </aside>
    <div class="admin__view">
      <div class="admin__view-item active">
        <div class="slider-admin">
          <div v-for="(slide, index) in slidesAdminArr" :key="slide.id" class="slider-admin__item">
            <div class="slider-admin__box">
              <img v-if="currFile[index] === null" :src="slide.imageURL" alt="" class="slider-admin__item-img">
              <img v-else :src="currFile[index]" alt="" class="slider-admin__item-img">
              <input v-on:change="checkFile(index)" ref="previewUrl" :id="slide.id" type="file" accept="image/png, image/jpeg, image/jpg" class="slider-admin__box-input">
              <label v-if="!checkDisable[index]" class="slider-admin__box-label" :for="slide.id"></label>
              <svg v-if="!checkDisable[index]" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path> </g></svg>
            </div>
            <div style="display: flex;flex-direction: column; justify-content: space-between; gap: 10px">
              <textarea v-model="slide.title" class="slider-admin__item-text" :disabled="checkDisable[index]"/>
              <input :disabled="checkDisable[index]" type="text" class="slider-admin__item-text" v-model="slide.urlTo" >
            </div>
            <div class="slider-admin__item-buttons">
              <svg @click="checkDisable[index] = false" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path> </g></svg>
              <svg @click="deleteSlide(slide.id)" width="64px" height="64px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>delete [#1487]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#00295F"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#1487]"> </path> </g> </g> </g> </g></svg>
            </div>
            <button @click="() => {saveChanges(slide.id, currFile[index] || slide.imageURL, slide.title, slide.urlTo, index); checkDisable[index] = true}" v-if="!checkDisable[index]" class="slider-admin__item-save admin-button">Сохранить</button>
          </div>
          <div v-if="newSlide" class="slider-admin__item">
            <div class="slider-admin__box">
              <img v-if="newFile === null" alt="" class="slider-admin__item-img">
              <img v-else :src="newFile" alt="" class="slider-admin__item-img">
              <input v-on:change="checkNewFile" ref="addUrl" id="new-slide" type="file" accept="image/png, image/jpeg, image/jpg" class="slider-admin__box-input">
              <label for="new-slide" class="slider-admin__box-label"></label>
              <svg width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path> </g></svg>
            </div>
            <textarea v-model="newText" class="slider-admin__item-text" placeholder="Введите текст для слайда"/>
            <button @click="addSlide" class="slider-admin__item-save admin-button">Сохранить</button>
          </div>
          <button @click="newSlide = true" class="slider-admin__add admin-button">Добавить слайд</button>
        </div>
      </div>
      <div class="admin__view-item">
        <router-link to="/create-event" style="position: absolute; right: 0" class="admin-button">Создать мероприятие</router-link>
        <div style="margin-top: 50px;" class="admin-event">
          <div class="admin-event__field" v-for="(event, index) in eventArr" v-show="eventsShow[index]">
            <router-link :to="'/events/event/' + event.id" class="event">
              <div class="event__date">
                <p class="event__date-day">{{ event.startDate.split('-').reverse().join('.') }}</p>
                <p class="event__date-time">{{ event.startTime }}</p>
              </div>
              <p class="event__name">{{ event.title }}</p>
            </router-link>
            <svg style="margin-left: 20px; cursor:pointer;" @click="deleteEvent(event.id, index)" width="32" height="32" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>delete [#1487]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#00295F"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#1487]"> </path> </g> </g> </g> </g></svg>
          </div>
        </div>
      </div>
      <div class="admin__view-item new-view">
          <router-link to="/admin/create_news" class="admin-button">Создать новость</router-link>
          <div class="news-all__field">
            <div v-for="(newsSlide, index) in newsSlider" class="new" v-show="newsShow[index]">
                <div class="slider-admin__box">
                  <img v-if="currNews[index] === null" :src="newsSlide.imageURL" alt="" class="slider-admin__item-img">
                  <img v-else :src="currNews[index]" alt="" class="slider-admin__item-img">
                  <input v-on:change="checkNew(index)" ref="newUrl" :id="newsSlide.id" type="file" accept="image/png, image/jpeg, image/jpg" class="slider-admin__box-input">
                  <label v-if="newsDisabler[index]" class="slider-admin__box-label" :for="newsSlide.id"></label>
                  <svg v-if="newsDisabler[index]" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path> </g></svg>
                </div>
                  <p class="new__date">{{ new Date(newsSlide.publicationDate).getDate() + ' ' + monthAssoc[newsSlide.publicationDate.split('-').reverse()[1]] }}</p>
                  <textarea maxlength="110" v-model="newsSlide.title" class="new__input" :disabled="!newsDisabler[index]"/>
                  <div class="news-admin__buttons">
                      <svg @click="newsDisabler[index] = true" width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#00295F"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path> </g></svg>
                      <svg @click="deleteNews(newsSlide.id, index)" width="30" height="30" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>delete [#1487]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#00295F"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#1487]"> </path> </g> </g> </g> </g></svg>
                      <router-link :to="'/news/new/' + newsSlide.id">
                          <svg fill="#00295F" width="30" height="30" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#00295F"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>link</title> <path d="M10.406 13.406l2.5-2.531c0.219-0.219 0.469-0.5 0.719-0.813 0.25-0.281 0.531-0.531 0.813-0.75 0.531-0.469 1.156-0.875 1.938-0.875 0.688 0 1.281 0.313 1.719 0.719s0.688 1 0.688 1.688c0 0.281-0.031 0.594-0.125 0.813-0.219 0.438-0.406 0.75-0.594 1-0.094 0.125-0.188 0.25-0.188 0.375 0 0.094 0 0.188 0.063 0.219 0.344 0.844 0.594 1.563 0.75 2.438 0.094 0.344 0.281 0.5 0.594 0.5 0.125 0 0.25-0.031 0.375-0.125 0.25-0.156 0.469-0.406 0.688-0.656 0.125-0.125 0.219-0.25 0.281-0.313 1.125-1.094 1.781-2.656 1.781-4.25 0-1.688-0.688-3.188-1.781-4.281-1.094-1.063-2.625-1.781-4.25-1.781s-3.188 0.656-4.281 1.813l-4.281 4.25c-1.125 1.156-1.75 2.656-1.75 4.25 0 0.469 0.188 1.438 0.5 2.344 0.313 0.875 0.719 1.656 1.25 1.656 0.281 0 0.875-0.469 1.375-1s1-1.125 1-1.344c0-0.156-0.125-0.344-0.25-0.625-0.156-0.281-0.219-0.625-0.219-1.031 0-0.625 0.25-1.25 0.688-1.688zM10.313 25.406l4.281-4.25c1.125-1.094 1.75-2.688 1.75-4.281 0-0.469-0.188-1.406-0.5-2.313-0.281-0.875-0.719-1.688-1.25-1.688-0.219 0-0.875 0.5-1.344 1.031-0.531 0.531-1.031 1.094-1.031 1.313 0 0.156 0.094 0.406 0.25 0.656 0.156 0.281 0.281 0.594 0.281 1-0.031 0.625-0.281 1.25-0.719 1.75l-2.531 2.5c-0.219 0.25-0.469 0.5-0.719 0.781l-0.781 0.781c-0.531 0.5-1.188 0.844-1.969 0.844-1.313 0-2.375-1.031-2.375-2.375 0-0.313 0.063-0.594 0.156-0.813 0.188-0.438 0.375-0.75 0.594-1 0.094-0.125 0.125-0.25 0.125-0.344 0-0.063-0.031-0.125-0.063-0.25-0.375-0.844-0.594-1.563-0.75-2.438-0.063-0.156-0.094-0.281-0.188-0.344-0.094-0.125-0.25-0.156-0.406-0.156-0.125 0-0.219 0.031-0.344 0.125-0.25 0.156-0.5 0.406-0.719 0.656-0.094 0.125-0.219 0.219-0.281 0.281-1.125 1.125-1.781 2.688-1.781 4.281 0 1.656 0.656 3.188 1.781 4.281 1.094 1.094 2.594 1.75 4.25 1.75 1.625 0 3.188-0.625 4.281-1.781z"></path> </g>#00295F</svg>
                      </router-link>
                  </div>
                  <button @click="saveNews(newsSlide.id, newsSlide.publicationDate, newsSlide.publicationTime, newsSlide.content, newsSlide.title, newsSlide.imageURL, index); newsDisabler[index] = false" v-if="newsDisabler[index]" class="news-admin__button admin-button">Сохранить</button>
              </div>
          </div>
      </div>
      <div class="admin__view-item">
        <div class="admin-schedule">
          <input ref="scheduleUrl" type="file">
          <button @click="uploadSchedule" class="admin-button">Загрузить</button>
        </div>
      </div>
      <div class="admin__view-item">
          <div class="admin-users">
            <div class="admin-users__item">
                <div class="admin-users__item-head">
                    <p class="admin-users__item-head_name">Пользователи</p>
                    <router-link to="/admin/create_user" class="admin-button">Добавить</router-link>
                </div>
                <div class="admin-users__item-list">
                    <div v-for="user in userList" class="user-item">
                      <p class="user-item__name">{{ user.lastName + ' ' + user.firstName + ' ' + user.patronymic }}</p>
                      <router-link :to="'/profile/' + user.id" style="margin-left: auto;" class="admin-button">Редактировать</router-link>
                      <button @click="deleteUser(user.id)" class="admin-button">Удалить</button>
                    </div>
                </div>
            </div>
          </div>
      </div>
      <div class="admin__view-item">
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
  <Loader v-if="isLoading"/>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.admin{
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 50px;

  @media (min-width: 1024px) and (max-width: 1480px) {
    max-width: calc(100% - 40px);
  }

  &__tabs{
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    flex-direction: column;

    &-item{
      width: 250px;
    }
  }

  &__view{
    width: 100%;

    &-item{
      display: none;
      position: relative;

      &.active{
        display: flex;
      }
    }

    .new{
      cursor: default;
    }
    
    .news-all__field{
      display: flex;
      align-items: stretch;
      flex-wrap: wrap;
      gap: 50px;
    }

    .new__input{
      font-size: 24px;
      line-height: 28px;
      background: white;
      padding: 10px;
      resize: none;
      height: 200px;
      border: 2px solid $pr1;
      border-radius: 10px;
      margin-left: 5px;

      &:disabled{
        border: none;
      }
    }

    .news-admin__buttons{
      display: flex;
      align-items: center;
      gap: 20px;
      margin: 0 auto;
      
      svg{
        cursor: pointer;
      }
    }

    .news-admin__button{
      margin: 0 auto;
      position: absolute;
      bottom: -40px;
      left: 0;
      right: 0;
    }
  }
}

.slider-admin{
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  &__item{
    display: flex;
    align-items: flex-start;
    gap: 10px;
    position: relative;

    &-img{
      width: 300px;
      height: 150px;
      object-fit: cover;
    }

    &-text{
      font-size: 20px;
      line-height: 24px;
      width: 100%;
      resize: none;
      border: 2px solid $pr1;
      border-radius: 10px;
      padding: 5px;

      &:disabled{
        border: none;
      }
    }

    &-buttons{
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      align-self: center;

      & svg{
        width: 30px;
        fill: $pr1;
        cursor: pointer;
      }
    }

    &-save{
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  &__add{
    align-self: center;
    width: 300px;
    margin-top: 20px;
  }
}

.slider-admin__box{
  width: 300px;
  height: 150px;
  position: relative;

  &-input{
    display: none;
  }

  &-label{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    cursor: pointer;
    z-index: 1;

    &:after{
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: $pr1;
      opacity: 0.3;
      z-index: -1;
    }
  }

  & svg{
    fill: $pr3;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
}

.admin-schedule{
  display: flex;
  align-items: center;
  gap: 10px;
}

.new-view{
  flex-direction: column;
  gap: 20px;

  .admin-button{
    width: 50%;
    align-self: center;
  }
}

.admin-users{
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;

  &__item{
    background: $pr3;
    border-radius: 10px;
    padding: 15px 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;

    &-head{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid $pr2;
      padding-bottom: 15px;

      &_name{
        font-size: 30px;
        line-height: 35px;
        color: $pr1;
      }
    }

    &-list{
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }
}

.user-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 13px 18px;
  border-radius: 10px;
  gap: 15px;

  &__name{
    font-size: 22px;
    line-height: 25px;
  }
}

.mails{
  width: 100%;
  background: $pr3;
  border-radius: 10px;
  border-spacing: 20px;
  margin-top: 60px;

  th{
    font-size: 24px;
    line-height: 28px;
    font-weight: 400;
    color: $pr1;
    letter-spacing: 0.015em;
    padding: 6px 0;
  }

  tbody tr{
    margin-bottom: 10px;
    background: white;

    td{
      text-align: center;
      font-size: 18px;
      line-height: 21px;
      letter-spacing: 0.015em;
    }
  }
}

.mails-button{
  position: absolute;
  right: 0;
}

.admin-event{
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  &__field{
    display: flex;
    align-items: center;
    width: 100%;

    .event{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 25px;

      &__date{
        display: flex;
        align-items: center;
        gap: 10px;

        &-day, &-time{
          font-weight: 700;
        }
      }

      &__name{
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

</style>