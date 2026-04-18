<template>
  <section class="static">
    <div style="display: flex; align-items: flex-start; justify-content: space-between;">
      <h1>{{ tab?.name || '' }}</h1>
      <button
        v-if="userRole === 'ADMIN' && tab && !isEditorActive && !isLoading"
        :class="{ visible: !isEditorActive }"
        @click="isEditorActive = true"
        class="edit-button admin-button"
      >
        Редактировать
      </button>
    </div>

    <div v-if="isLoading" class="static__loading">Загрузка...</div>

    <div v-else-if="isNotFound" class="static__not-found">
      <h2>Страница не найдена</h2>
      <p>Вкладка с адресом «{{ currentPath }}» не существует или недоступна.</p>
    </div>

    <template v-else-if="tab">
      <div
        v-if="!content && !isEditorActive && userRole !== 'ADMIN'"
        class="static__empty"
      >
        Контент пока не добавлен
      </div>

      <div
        v-if="!content && !isEditorActive && userRole === 'ADMIN'"
        class="static__empty"
      >
        <p>Контент пока не добавлен</p>
        <button @click="isEditorActive = true" style="margin-top: 10px" class="admin-button">
          Добавить контент
        </button>
      </div>

      <ckeditor
        v-if="isEditorActive && userRole === 'ADMIN'"
        :editor="editor"
        v-model="content"
        :config="editorConfig"
        @ready="onReady"
        class="static__editor"
      ></ckeditor>

      <div
        v-if="isEditorActive && userRole === 'ADMIN'"
        class="static__editor-actions"
      >
        <button @click="savePage" :disabled="isSaving" class="admin-button">
          {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
        </button>
        <button @click="cancelEdit" :disabled="isSaving" class="admin-button">
          Отмена
        </button>
      </div>

      <div
        v-if="content && !isEditorActive"
        class="new-editor"
        v-html="content"
      ></div>
    </template>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import CustomUploader from '@/services/customUploader'
import axios from 'axios'
import { userAuth } from '@/store/userAuth'
import { useTabsStore } from '@/store/tabsStore'

const route = useRoute()
const authStore = userAuth()
const tabsStore = useTabsStore()

const tab = ref(null)
const content = ref('')
const savedContent = ref('')
const userRole = ref('')
const isLoading = ref(true)
const isNotFound = ref(false)
const isEditorActive = ref(false)
const isSaving = ref(false)
const toolbarElement = ref(null)

const currentPath = computed(() => route.path)

const editor = ref(DecoupledEditor)
const editorConfig = ref({
  language: 'ru',
  mediaEmbed: {
    previewsInData: true,
    providers: [
      {
        name: 'rutube',
        url: [
          /rutube\.ru\/video\/([a-zA-Z0-9]+)/,
          /rutube\.ru\/([a-zA-Z0-9]+)/,
        ],
        html: (match) => {
          const id = match[1] || match.input.split('/').pop()
          return `<div class="rutube-container">
            <iframe src="https://rutube.ru/play/embed/${id}" frameborder="0" allowfullscreen></iframe>
          </div>`
        },
      },
    ],
  },
})

const onReady = (editorInstance) => {
  toolbarElement.value = editorInstance.ui.view.toolbar.element
  editorInstance.ui
    .getEditableElement()
    .parentElement.insertBefore(
      editorInstance.ui.view.toolbar.element,
      editorInstance.ui.getEditableElement(),
    )

  editorInstance.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new CustomUploader(loader)
  }
}

const removeToolbar = () => {
  if (toolbarElement.value && toolbarElement.value.parentElement) {
    toolbarElement.value.parentElement.removeChild(toolbarElement.value)
  }
  toolbarElement.value = null
}

const loadPage = async () => {
  isLoading.value = true
  isNotFound.value = false
  tab.value = null
  content.value = ''
  savedContent.value = ''

  userRole.value = authStore.getRole

  await tabsStore.loadAllTabs()

  const foundTab = tabsStore.findTabByUrl(route.path)
  if (!foundTab) {
    isNotFound.value = true
    isLoading.value = false
    return
  }
  tab.value = foundTab

  try {
    const { data } = await axios.get(`tabs/${foundTab.id}/content`)
    content.value = data.content || ''
    savedContent.value = content.value
  } catch (e) {
    if (e.response?.status === 404) {
      isNotFound.value = true
    } else {
      content.value = ''
      savedContent.value = ''
    }
  } finally {
    isLoading.value = false
  }
}

const savePage = async () => {
  if (!tab.value) return
  isSaving.value = true
  try {
    await axios.put(`tabs/${tab.value.id}/content`, { content: content.value })
    savedContent.value = content.value
    removeToolbar()
    isEditorActive.value = false
  } catch (e) {
    alert('Не удалось сохранить. Попробуйте ещё раз.')
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = () => {
  content.value = savedContent.value
  removeToolbar()
  isEditorActive.value = false
}

onMounted(() => {
  loadPage()
})

onBeforeUnmount(() => {
  removeToolbar()
})

watch(
  () => route.path,
  (newPath, oldPath) => {
    if (newPath !== oldPath) {
      removeToolbar()
      isEditorActive.value = false
      loadPage()
    }
  }
)
</script>

<style lang="scss">
@import "@/assets/styles/_variables.scss";

.static {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px 0 40px;

  @media (max-width: 1480px) {
    max-width: calc(100% - 40px);
  }

  u {
    text-decoration: underline !important;
  }

  s {
    text-decoration: line-through !important;
  }

  ul {
    padding-left: 25px;
    margin: 10px 0;

    li {
      font-size: 18px;
    }
  }

  h1 {
    margin-bottom: 30px;
  }

  p {
    font-size: 22px;
    line-height: 24px;
  }

  img {
    width: 100%;
  }

  .image-style-align-left {
    float: left;
  }

  &__editor {
    border: 1px solid $pr1;
    min-height: 350px;
    width: 100%;
  }

  &__editor-actions {
    display: flex;
    gap: 10px;
    margin: 10px 0 10px auto;
    justify-content: flex-end;
  }

  &__loading,
  &__empty,
  &__not-found {
    padding: 40px 0;
    text-align: center;
    color: $sc5;
    font-size: 18px;
  }

  &__not-found h2 {
    margin-bottom: 10px;
    color: $pr1;
  }

  .static__editor,
  .new-editor {
    .rutube-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      margin: 20px 0;
      width: 100%;

      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100% !important;
        border: none;
      }
    }

    iframe {
      width: 100% !important;
      height: 400px !important;
      border: none;
    }
  }
}
</style>
