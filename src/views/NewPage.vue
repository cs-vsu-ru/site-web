<template>
    <div style="max-width: 1440px; margin: 0 auto;" v-if="destination">
        <div style="display: flex; align-items: flex-start; justify-content: space-between;">
            <h1 style="margin-bottom: 40px;">{{ destination.title }}</h1>
            <button :class="{visible: !isEditorActive}" @click="isEditorActive = true" v-if="userRole === 'ROLE_ADMIN'" class="edit-button admin-button">Редактировать</button>
        </div>
        <ckeditor
            :editor="editor"
            v-model="destination.content"
            :config="editorConfig"
            @ready="onReady"
            v-if="isEditorActive && userRole === 'ROLE_ADMIN'"
        >

        </ckeditor>
        <button v-if="isEditorActive && userRole === 'ROLE_ADMIN'" @click="saveNew(destination.content)" style="margin: 10px 0 10px auto;" class="admin-button">Сохранить</button>
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
    await axios.get('articles')
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
    await axios.put('articles/' + destinationId.value, {
        id: destinationId.value,
        publicationDate: destination.value.publicationDate,
        publicationTime: destination.value.publicationTime,
        content: content,
        title: destination.value.title,
        imageURL: destination.value.imageURL,
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
.ce-toolbar__content, .ce-block__content{
  max-width: 1440px;
  margin: 0 auto;
}

.new-editor{
    max-width: 1440px;
    margin: 0 auto;

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
</style>