<template>
  <section class="static">
    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <h1>Политика конфиденциальности</h1>
      <button :class="{visible: !isEditorActive}" @click="isEditorActive = true" v-if="userRole === 'ROLE_ADMIN' || userRole === 'ROLE_MODERATOR'" class="edit-button admin-button">Редактировать</button>
    </div>
    <ckeditor
        :editor="editor"
        v-model="staticInfo.contentConfidential"
        :config="editorConfig"
        @ready="onReady"
        v-if="isEditorActive && (userRole === 'ROLE_ADMIN' || userRole === 'ROLE_MODERATOR')"
        class="static__editor"
    ></ckeditor>
    <button v-if="isEditorActive && (userRole === 'ROLE_ADMIN' || userRole === 'ROLE_MODERATOR')" @click="saveStatic" style="margin: 10px 0 10px auto;" class="admin-button">Сохранить</button>
    <div class="new-editor" v-if="staticInfo && !isEditorActive" v-html="staticInfo.contentConfidential">

    </div>
  </section>
</template>

<script setup>
import {onMounted, ref} from "vue";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import CustomUploader from "@/services/customUploader";
import axios from "axios";

const staticInfo = ref(null)
const userRole = ref('')
const aboutModel = ref('')
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

onMounted(() => {
  checkRole()
  getStatic()
})

const onReady = (editor) => {
  editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
  )

  editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    return new CustomUploader(loader)
  }
}

const checkRole = async () => {
  await axios.get('account')
      .then((items) => {
        userRole.value = items.data.mainRole
      })
}

const getStatic = async () => {
  await axios.get('static-pages')
      .then((staticData) => {
        staticInfo.value = staticData.data[0]

        console.log(staticInfo.value.contentConfidential)
      })
}

const saveStatic = async () => {
  await axios.put('static-page/1', {
    id: 1,
    contentConfidential: staticInfo.value.contentConfidential
  })
      .then(() => {
        location.reload()
      })
}
</script>

<style lang="scss">
@import "@/assets/styles/_variables.scss";

.static{
  max-width: 1440px;
  margin: 0 auto;

  @media (max-width: 1480px) {
    max-width: calc(100% - 40px);
  }

  h1{
    margin-bottom: 30px;
  }

  p{
    font-size: 22px;
    line-height: 24px;
  }

  img{
    width: 100%;
  }

  &__editor{
    border: 1px solid $pr1;
    min-height: 350px;
  }
}
</style>