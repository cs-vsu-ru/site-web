<template>
  <div class="event-main" style="max-width: 1440px; margin: 0 auto;" v-if="eventInfo">
    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <h1 v-if="!isEditorActive" style="margin-bottom: 40px;">{{ eventInfo.title }}</h1>
      <textarea v-else class="editor-text-area" v-model="eventInfo.title"></textarea>
      <button :class="{visible: !isEditorActive}" @click="isEditorActive = true" v-if="userRole === 'ADMIN' || userRole === 'MODERATOR'" class="edit-button admin-button">Редактировать</button>
    </div>
    <div class="event-dates">
      <p class="event-dates__date">
        Дата начала -
        <input :disabled="!isEditorActive" max="2100-01-01" :min="new Date().toISOString().split('T')[0]" id="event-date" v-model="formattedStartDate" type="date" class="event-dates__item">
      </p>
      <p class="event-dates__time">
        Время начала -
        <input :disabled="!isEditorActive" id="event-time" v-model="formattedStartTime" type="time" class="event-dates__item">
      </p>
    </div>
    <div class="event-dates">
      <p class="event-dates__date">
        Дата окончания -
        <input :disabled="!isEditorActive" max="2100-01-01" :min="new Date().toISOString().split('T')[0]" id="event-date" v-model="formattedEndDate" type="date" class="event-dates__item">
      </p>
      <p class="event-dates__time">
        Время окончания -
        <input :disabled="!isEditorActive" id="event-time" v-model="formattedEndTime" type="time" class="event-dates__item">
      </p>
    </div>
    <ckeditor
        :editor="editor"
        v-model="eventInfo.content"
        :config="editorConfig"
        @ready="onReady"
        v-if="isEditorActive && (userRole === 'ADMIN' || userRole === 'MODERATOR')"
        class="ckeditor-all"
    >

    </ckeditor>
    <button v-if="isEditorActive && (userRole === 'ADMIN' || userRole === 'MODERATOR')" @click="saveNew(eventInfo.content)" style="margin: 10px 0 10px auto;" class="admin-button">Сохранить</button>
  </div>
  <div class="new-editor" v-if="eventInfo && !isEditorActive" v-html="eventInfo.content">

  </div>
</template>

<script setup>
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import '@ckeditor/ckeditor5-build-classic/build/translations/ru'
import CustomUploader from "@/services/customUploader";
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import {userAuth} from "@/store/userAuth";

const store = userAuth()
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
const eventInfo = ref([])



onMounted(() => {
  userRole.value = store.getRole
  getEvent()
})

const formattedStartDate = computed({
  get() {
    return formatDateToString(eventInfo.value.startDateTime);
  },
  set(value) {
    eventInfo.value.startDateTime = setDateFromString(value);
  }
});

const formattedEndDate = computed({
  get() {
    return formatDateToString(eventInfo.value.endDateTime);
  },
  set(value) {
    eventInfo.value.endDateTime = setDateFromString(value);
  }
});

const formatDateToString = (eventDate) => {
  const dateObject = new Date(eventDate);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const setDateFromString = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return new Date(year, month - 1, day);
}

const formattedStartTime = computed({
  get() {
    return formatTimeToString(eventInfo.value.startDateTime);
  },
  set(value) {
    const dateString = formatDateToString(eventInfo.value.startDateTime);
    eventInfo.value.startDateTime = setTimeFromString(`${dateString}T${value}`);
  }
});

const formattedEndTime = computed({
  get() {
    return formatTimeToString(eventInfo.value.endDateTime);
  },
  set(value) {
    const dateString = formatDateToString(eventInfo.value.endDateTime);
    eventInfo.value.endDateTime = setTimeFromString(`${dateString}T${value}`);
  }
});

const formatTimeToString = (eventDate) => {
  const dateObject = new Date(eventDate);
  return `${dateObject
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateObject
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

}

const setTimeFromString = (dateTimeString) => {
  const [dateString, timeString] = dateTimeString.split('T');
  const [year, month, day] = dateString.split('-');
  const [hours, minutes] = timeString.split(':');
  const currentDate = new Date();
  currentDate.setFullYear(year, month - 1, day);
  currentDate.setHours(hours, minutes, 0, 0);
  return currentDate.toISOString();
}
const getEvent = async () => {
  const eventId = route.params.id;
  await axios.get(`events/${eventId}`)
      .then((event) => {
        eventInfo.value = event.data
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
  const eventId = route.params.id;
  await axios.put('events/' + eventId, {
    id: eventId,
    content: content,
    title: eventInfo.value.title,
    startDateTime: eventInfo.value.startDateTime,
    endDateTime: eventInfo.value.endDateTime,
  })
      .then(() => {
        location.reload()
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