<template>
  <section class="static">
    <div
      style="
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      "
    >
      <h1>О кафедре</h1>
      <button
        :class="{ visible: !isEditorActive }"
        @click="isEditorActive = true"
        v-if="userRole === 'ADMIN' || userRole === 'MODERATOR'"
        class="edit-button admin-button"
      >
        Редактировать
      </button>
    </div>
    <ckeditor
      :editor="editor"
      v-model="staticInfo.contentAbout"
      :config="editorConfig"
      @ready="onReady"
      v-if="
        isEditorActive && (userRole === 'ADMIN' || userRole === 'MODERATOR')
      "
      class="static__editor"
    ></ckeditor>
    <button
      v-if="
        isEditorActive && (userRole === 'ADMIN' || userRole === 'MODERATOR')
      "
      @click="saveStatic"
      style="margin: 10px 0 10px auto"
      class="admin-button"
    >
      Сохранить
    </button>
    <div
      class="new-editor"
      v-if="staticInfo && !isEditorActive"
      v-html="staticInfo.contentAbout"
    ></div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import CustomUploader from "@/services/customUploader";
import axios from "axios";
import { userAuth } from "@/store/userAuth";

const store = userAuth();
const staticInfo = ref(null);
const userRole = ref("");
const aboutModel = ref("");
const isEditorActive = ref(false);
const editor = ref(DecoupledEditor);
const editorConfig = ref({
  language: "ru",
  mediaEmbed: {
    previewsInData: true,
    providers: [
      {
        name: "rutube",
        url: [
          /rutube\.ru\/video\/([a-zA-Z0-9]+)/,
          /rutube\.ru\/([a-zA-Z0-9]+)/,
        ],
        html: (match) => {
          const id = match[1] || match.input.split("/").pop();
          return `<div class="rutube-container">
            <iframe src="https://rutube.ru/play/embed/${id}" frameborder="0" allowfullscreen></iframe>
          </div>`;
        },
      },
    ],
  },
});

onMounted(() => {
  userRole.value = store.getRole;
  getStatic();
});

const onReady = (editor) => {
  editor.ui
    .getEditableElement()
    .parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement(),
    );

  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new CustomUploader(loader);
  };
};

const getStatic = async () => {
  await axios.get("static-pages").then((staticData) => {
    staticInfo.value = staticData.data[0];
  });
};

const saveStatic = async () => {
  await axios
    .put("static-pages/1", {
      id: 1,
      contentAbout: staticInfo.value.contentAbout,
    })
    .then(() => {
      location.reload();
    });
};
</script>

<style lang="scss">
@import "@/assets/styles/_variables.scss";

.static {
  max-width: 1440px;
  margin: 0 auto;
  padding-top: 20px;

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

    u {
      text-decoration: underline;
    }

    s {
      text-decoration: line-through;
    }
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
