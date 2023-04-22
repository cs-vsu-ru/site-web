<template>
    <div style="max-width: 1440px; margin: 0 auto;">
        <ckeditor
            :editor="editor"
            v-model="editorData"
            :config="editorConfig"
        >

        </ckeditor>
    </div>
</template>

<script setup>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {ref} from "vue";

const editor = ref(ClassicEditor)
const editorData = ref('')
const editorConfig = ref({
    toolbar: [
        'undo', 'redo',
        '|', 'heading',
        '|', 'bold', 'italic',
        '|', 'link', 'uploadImage', 'insertTable', 'mediaEmbed',
        '|', 'bulletedList', 'numberedList', 'outdent', 'indent'
    ]
})


</script>

<style lang="scss">
.ce-toolbar__content, .ce-block__content{
  max-width: 1440px;
  margin: 0 auto;
}
</style>