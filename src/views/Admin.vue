<template>
  <section class="admin">
    <aside class="admin__tabs">
      <button class="admin__tabs-item admin-button active">Слайдер</button>
      <button class="admin__tabs-item admin-button">Мероприятия</button>
      <button class="admin__tabs-item admin-button">Новости</button>
    </aside>
    <div class="admin__view">
      <div class="admin__view-item">
        <div class="slider-admin">
          <div v-for="(slide, index) in slidesAdminArr" :key="slide.id" class="slider-admin__item">
            <div class="slider-admin__box">
              <img v-if="currFile[index] === null" :src="slide.imageURL" alt="" class="slider-admin__item-img">
              <img v-else :src="currFile[index]" alt="" class="slider-admin__item-img">
              <input v-on:change="checkFile(index)" ref="previewUrl" :id="slide.id" type="file" accept="image/png, image/jpeg, image/jpg" class="slider-admin__box-input">
              <label v-if="!checkDisable[index]" class="slider-admin__box-label" :for="slide.id"></label>
              <svg v-if="!checkDisable[index]" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path> </g></svg>
            </div>
            <textarea v-model="slide.title" class="slider-admin__item-text" :disabled="checkDisable[index]"/>
            <div class="slider-admin__item-buttons">
              <svg @click="checkDisable[index] = false" width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path> </g></svg>
              <svg @click="deleteSlide(slide.id)" width="64px" height="64px" viewBox="0 -0.5 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>delete [#1487]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-179.000000, -360.000000)" fill="#00295F"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M130.35,216 L132.45,216 L132.45,208 L130.35,208 L130.35,216 Z M134.55,216 L136.65,216 L136.65,208 L134.55,208 L134.55,216 Z M128.25,218 L138.75,218 L138.75,206 L128.25,206 L128.25,218 Z M130.35,204 L136.65,204 L136.65,202 L130.35,202 L130.35,204 Z M138.75,204 L138.75,200 L128.25,200 L128.25,204 L123,204 L123,206 L126.15,206 L126.15,220 L140.85,220 L140.85,206 L144,206 L144,204 L138.75,204 Z" id="delete-[#1487]"> </path> </g> </g> </g> </g></svg>
            </div>
            <button @click="() => {saveChanges(slide.id, currFile[index] || slide.imageURL, slide.title, index); checkDisable[index] = true}" v-if="!checkDisable[index]" class="slider-admin__item-save admin-button">Сохранить</button>
          </div>
          <div v-if="newSlide" class="slider-admin__item">
            <div class="slider-admin__box">
              <img v-if="newFile === null" alt="" class="slider-admin__item-img">
              <img v-else :src="newFile" alt="" class="slider-admin__item-img">
              <input v-on:change="checkNewFile" ref="newUrl" id="new-slide" type="file" accept="image/png, image/jpeg, image/jpg" class="slider-admin__box-input">
              <label for="new-slide" class="slider-admin__box-label"></label>
              <svg width="64px" height="64px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"></path> </g></svg>
            </div>
            <textarea v-model="newText" class="slider-admin__item-text" placeholder="Введите текст для слайда"/>
            <button @click="addSlide" class="slider-admin__item-save admin-button">Сохранить</button>
          </div>
          <button @click="newSlide = true" class="slider-admin__add admin-button">Добавить слайд</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const slidesAdminArr = ref([])
const checkDisable = ref([])
const previewUrl = ref([])
const currFile = ref([])
const newSlide = ref(false)
const newText = ref('')
const newUrl = ref(null)
const newFile = ref(null)

onMounted(() => {
  getSlidesForAdmin()
})

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

const saveChanges = async (slideId, imageURL, title, slideIdx) => {
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
            urlTo: 'https://www.vsu.ru/'
          })
        })
  }
  else {
    await axios.put('sliders/' + slideId, {
      id: slideId,
      imageURL: imageURL,
      title: title,
      urlTo: 'https://www.vsu.ru/'
    })
  }
}

const checkFile = (currId) => {
  currFile.value[currId] = URL.createObjectURL(previewUrl.value[currId].files[0])
}

const addSlide = async () => {
  let formData = new FormData()

  formData.append('file', newUrl.value.files[0])

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
  newFile.value = URL.createObjectURL(newUrl.value.files[0])
}

const deleteSlide = async (slideId) => {
  await axios.delete('sliders/' + slideId)
      .then(() => {
        location.reload()
      })
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.admin{
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 50px;

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
  }
}

.slider-admin{
  display: flex;
  flex-direction: column;
  gap: 10px;

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
      width: 700px;
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
</style>