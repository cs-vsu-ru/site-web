<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import CustomUploader from "@/services/customUploader";

onMounted(async () => {
  await axios.get('pages')
})

const editor = ref(DecoupledEditor)
const editorConfig = ref({
  language: 'ru'
})
const newsTitle = ref('')
const newsContent = ref('')
const profileImg = ref(null)
const imgUrl = ref(null)

const checkImg = () => {
  profileImg.value = URL.createObjectURL(imgUrl.value.files[0])
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

const createNews = async () => {
  let formData = new FormData()

  formData.append('file', imgUrl.value.files[0])

  await axios.post('uploadFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
      .then(async (urlData) => {
        await axios.post('articles', {
          title: newsTitle.value,
          imageURL: urlData.data,
          content: newsContent.value,
          publicationDate: new Date().toJSON().slice(0,10).replace(/-/g,'-')
        })
      })
      .then(() => {
        location.reload()
      })
}
</script>

<template>
  <section class="user-create">
    <h1 class="user-create__title">Создание новости</h1>
    <div class="user-create__field">
      <div class="user-create__field-left create-news__left">
        <div class="create-box">
          <img v-if="profileImg !== null" :src="profileImg" alt="" class="create-box__image">
        </div>
        <input v-on:change="checkImg" ref="imgUrl" type="file" accept="image/png, image/jpeg, image/jpg" style="display: none" id="create_image">
        <label for="create_image" class="create-box__label">Загрузить</label>
      </div>
      <div class="user-create__field-right">
        <div class="user-data create-news__data">
          <div class="user-data__item">
            <p class="user-data__item-name">Название</p>
            <input v-model="newsTitle" type="text" class="user-data__item-input">
          </div>
          <div class="user-extension new-field">
            <p class="user-data__item-name">Текст новости</p>
            <ckeditor
                :editor="editor"
                v-model="newsContent"
                :config="editorConfig"
                @ready="onReady"
                class="news--editor"
            >

            </ckeditor>
          </div>
        </div>
      </div>
    </div>
    <div class="user-create__buttons">
      <button @click="createNews" class="user-create__buttons-item">Создать</button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.new-field{
  padding: 0;
  height: 100%;
  gap: 5px;
  margin-top: 10px;
}

.create-news__left{
  padding: 50px 20px;
}

.create-news__data{
  padding: 20px;
}

.news--editor{
  background: white;
  border: 1px solid $pr1;
  height: 100%;
  max-width: 1000px;
}
</style>