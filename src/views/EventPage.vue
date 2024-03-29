<template>
  <div class="event-main" style="max-width: 1440px; margin: 0 auto;" v-if="destination">
    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <h1 v-if="!isEditorActive" style="margin-bottom: 40px;">{{ destination.title }}</h1>
      <textarea v-else class="editor-text-area" v-model="destination.title"></textarea>
      <button :class="{visible: !isEditorActive}" @click="isEditorActive = true" v-if="userRole === 'ROLE_ADMIN' || userRole === 'ROLE_MODERATOR'" class="edit-button admin-button">Редактировать</button>
    </div>
    <div class="event-dates">
      <p class="event-dates__date">
        Дата начала -
        <input :disabled="!isEditorActive" max="2100-01-01" :min="new Date().toISOString().split('T')[0]" id="event-date" v-model="destination.startDate" type="date" class="event-dates__item">
      </p>
      <p class="event-dates__time">
        Время начала -
        <input :disabled="!isEditorActive" id="event-time" v-model="destination.startTime" type="time" class="event-dates__item">
      </p>
    </div>
    <ckeditor
        :editor="editor"
        v-model="destination.content"
        :config="editorConfig"
        @ready="onReady"
        v-if="isEditorActive && (userRole === 'ROLE_ADMIN' || userRole === 'ROLE_MODERATOR')"
        class="ckeditor-all"
    >

    </ckeditor>
    <button v-if="isEditorActive && (userRole === 'ROLE_ADMIN' || userRole === 'ROLE_MODERATOR')" @click="saveNew(destination.content)" style="margin: 10px 0 10px auto;" class="admin-button">Сохранить</button>
  </div>
  <div class="new-editor" v-if="destination && !isEditorActive" v-html="destination.content">

  </div>
</template>

<script setup>
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import '@ckeditor/ckeditor5-build-classic/build/translations/ru'
import CustomUploader from "@/services/customUploader";
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";

const userRole = ref('')
const isEditorActive = ref(false)
const editor = ref(DecoupledEditor)
const editorConfig = ref({
  // toolbar: [
  //     'undo', 'redo',
  //     '|', 'heading',
  //     '|', 'bold', 'italic',
  //     '|', 'link', 'uploadImage', 'insertTable', 'mediaEmbed',
  //     '|', 'bulletedList', 'numberedList', 'outdent', 'indent'
  // ],
  language: 'ru'
})

const route = useRoute()
const newsInfo = ref([])

const destinationId = computed(() => route.params.id)
const destination = computed(() => {
  return newsInfo.value.find(item => item.id == destinationId.value)
})

onMounted(() => {
  newsList()
  checkRole()
})

const newsList = async () => {
  await axios.get('events')
      .then((news) => {
        newsInfo.value = news.data
      })
}

const onReady = (editor) => {
  editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
  )

  editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    return new CustomUploader(loader)
  }
}

const saveNew = async (content) => {
  await axios.put('events/' + destinationId.value, {
    id: destinationId.value,
    publicationDate: destination.value.publicationDate,
    publicationTime: destination.value.publicationTime,
    startDate: destination.value.startDate,
    startTime: destination.value.startTime,
    content: content,
    title: destination.value.title,
  })
      .then(() => {
        location.reload()
      })
}

const checkRole = async () => {
  await axios.get('account')
      .then((items) => {
        userRole.value = items.data.mainRole
      })
}

</script>

<style lang="scss">
@import "@/assets/styles/_variables.scss";

.ce-toolbar__content, .ce-block__content{
  max-width: 1440px;
  margin: 0 auto;
}

.new-editor{
  max-width: 1440px;
  margin: 0 auto;

  u{
    text-decoration: underline !important;
  }
  s{
    text-decoration: line-through !important;
  }


  p{
    font-size: 20px;
    line-height: 24px;
  }

  img{
    width: 100%;
  }
}

.edit-button{
  display: none;

  &.visible{
    display: flex;
  }
}

.event-main{
  height: 100%;

  .ckeditor-all{
    border: 1px solid $pr1;
    height: 100%;
  }
}

.editor-text-area{
  width: 100%;
  resize: none;
  border: 1px solid $pr1;
  margin-bottom: 40px;
  padding: 10px;
  font-size: 50px;
  font-family: 'Lora', serif;
  font-weight: 700;
  line-height: 64px;
  letter-spacing: 0.015em;
}

.event-dates__date, #event-date{
  font-size: 36px;
  font-weight: 500;
  line-height: 42px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.event-dates__time{
  font-size: 30px;
  line-height: 35px;
  color: $pr1;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  gap: 15px;
}

#event-time{
  font-size: 30px;
  line-height: 35px;
  color: $pr1;
}

#event-date:not(:disabled), #event-time:not(:disabled){
  cursor: pointer;
}

</style>