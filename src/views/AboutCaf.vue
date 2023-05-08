<template>
  <section class="static">
    <h1>О кафедре</h1>
    <ckeditor
        :editor="editor"
        v-model="aboutModel"
        :config="editorConfig"
        @ready="onReady"
    ></ckeditor>
  </section>
</template>

<script setup>
  import {ref} from "vue";
  import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
  import CustomUploader from "@/services/customUploader";

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

  const onReady = (editor) => {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    )

    editor.plugins.get('FileRepository').createUploadAdapter = loader => {
      return new CustomUploader(loader)
    }
  }
</script>

<style lang="scss">
.static{
  max-width: 1440px;
  margin: 0 auto;

  h1{
    margin-bottom: 30px;
  }

  p{
    font-size: 22px;
    line-height: 24px;
  }
}
</style>