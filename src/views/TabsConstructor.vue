<template>
  <div>
    <div class="tabs-constructor">
      <div class="tabs-constructor__header">
        <button @click="openCreateDialog" class="admin-button">+ Добавить вкладку</button>
      </div>

      <div v-if="isLoading" class="tabs-constructor__loading">Загрузка...</div>
      <div v-else-if="tabs.length === 0" class="tabs-constructor__empty">Нет вкладок. Создайте первую.</div>

      <div v-else class="tabs-constructor__list">
        <div class="tabs-constructor__list-header">
          <span></span>
          <span>Название</span>
          <span>URL</span>
          <span style="text-align: center;">Видимость</span>
          <span style="text-align: center;">Действия</span>
        </div>
        <draggable v-model="tabs" item-key="id" handle=".drag-handle" @end="onDragEnd">
          <template #item="{ element }">
            <div class="tabs-constructor__row" :class="{ 'tabs-constructor__row--hidden': !element.visible }">
              <span class="drag-handle">⠿</span>
              <span class="tabs-constructor__row-name" :title="element.name">
                <span class="tabs-constructor__row-name-text">{{ element.name }}</span>
                <span v-if="!element.visible" class="tabs-constructor__row-badge">(скрыта)</span>
              </span>
              <span class="tabs-constructor__row-url" :title="element.url">{{ element.url }}</span>
              <label class="toggle" style="justify-self: center;" @click.prevent="toggleVisibility(element)">
                <input type="checkbox" :checked="element.visible" />
                <span class="toggle__slider"></span>
              </label>
              <div class="tabs-constructor__row-actions">
                <button @click="openEditDialog(element)" class="tabs-constructor__icon-btn" title="Редактировать">
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#00295F"/>
                  </svg>
                </button>
                <button @click="confirmDelete(element)" class="tabs-constructor__icon-btn tabs-constructor__icon-btn--delete" title="Удалить">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" stroke="#00295F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Edit/Create modal -->
    <GDialog v-model="editDialogState" :max-width="450">
      <div class="tabs-constructor__modal">
        <h3>{{ editingTab ? 'Редактировать вкладку' : 'Добавить вкладку' }}</h3>
        <div class="tabs-constructor__modal-field">
          <label>Название</label>
          <input v-model="form.name" type="text" placeholder="Введите название вкладки" class="tabs-constructor__modal-input" />
          <span v-if="formErrors.name" class="tabs-constructor__modal-error">{{ formErrors.name }}</span>
        </div>
        <div class="tabs-constructor__modal-field">
          <label>URL</label>
          <input v-model="form.url" type="text" placeholder="/example-page" :disabled="editingTab !== null" class="tabs-constructor__modal-input tabs-constructor__modal-input--mono" />
          <span v-if="formErrors.url" class="tabs-constructor__modal-error">{{ formErrors.url }}</span>
        </div>
        <div class="tabs-constructor__modal-field">
          <label>Порядок сортировки</label>
          <input v-model.number="form.sortOrder" type="number" min="0" class="tabs-constructor__modal-input" />
        </div>
        <div class="tabs-constructor__modal-field tabs-constructor__modal-field--toggle">
          <label class="toggle" @click.prevent="form.visible = !form.visible">
            <input type="checkbox" :checked="form.visible" />
            <span class="toggle__slider"></span>
          </label>
          <span>Видимая для пользователей</span>
        </div>
        <div class="tabs-constructor__modal-actions">
          <button @click="editDialogState = false" class="admin-button">Отмена</button>
          <button @click="saveTab" class="admin-button tabs-constructor__save-btn">Сохранить</button>
        </div>
      </div>
    </GDialog>

    <!-- Delete confirmation modal -->
    <GDialog v-model="deleteDialogState" :max-width="400">
      <div class="tabs-constructor__modal tabs-constructor__modal--delete">
        <p>Вы уверены, что хотите удалить вкладку
          <strong>«{{ tabToDelete?.name }}»</strong>?
        </p>
        <p class="tabs-constructor__modal-warning">Вместе с вкладкой будет удалён весь её контент. Это действие необратимо.</p>
        <div class="tabs-constructor__modal-actions">
          <button @click="deleteDialogState = false" class="admin-button">Отмена</button>
          <button @click="deleteTab" class="admin-button tabs-constructor__delete-btn">Удалить</button>
        </div>
      </div>
    </GDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import draggable from 'vuedraggable'
import { GDialog } from 'gitart-vue-dialog/dist/index'
import { useTabsStore } from '@/store/tabsStore'

const tabsStore = useTabsStore()

const localTabs = ref([])
const isLoading = computed(() => tabsStore.isLoadingAll)
const editDialogState = ref(false)
const deleteDialogState = ref(false)
const editingTab = ref(null)
const tabToDelete = ref(null)
const form = ref({ name: '', url: '', sortOrder: 0, visible: true })
const formErrors = ref({ name: '', url: '' })

const tabs = computed({
  get: () => localTabs.value,
  set: (value) => { localTabs.value = value },
})

const syncFromStore = () => {
  localTabs.value = [...tabsStore.allTabs]
}

const loadTabs = async () => {
  await tabsStore.loadAllTabs(true)
  syncFromStore()
}

onMounted(() => { loadTabs() })

// Drag-and-drop reorder
const onDragEnd = async () => {
  const previousTabs = [...localTabs.value]
  const items = localTabs.value.map((tab, index) => ({ id: tab.id, sortOrder: index + 1 }))
  localTabs.value.forEach((tab, index) => { tab.sortOrder = index + 1 })
  try {
    await axios.put('tabs/reorder', { items })
    await tabsStore.invalidate()
    syncFromStore()
  } catch (e) {
    localTabs.value = previousTabs
    alert('Не удалось сохранить порядок. Попробуйте ещё раз.')
  }
}

// Toggle visibility
const toggleVisibility = async (tab) => {
  const previousValue = tab.visible
  tab.visible = !tab.visible
  try {
    await axios.put(`tabs/${tab.id}`, { visible: tab.visible })
    await tabsStore.invalidate()
  } catch (e) {
    tab.visible = previousValue
    alert('Ошибка изменения видимости')
  }
}

// Create/Edit dialog
const resetForm = () => {
  form.value = { name: '', url: '', sortOrder: localTabs.value.length + 1, visible: true }
  formErrors.value = { name: '', url: '' }
}

const openCreateDialog = () => {
  editingTab.value = null
  resetForm()
  editDialogState.value = true
}

const openEditDialog = (tab) => {
  editingTab.value = tab
  form.value = { name: tab.name, url: tab.url, sortOrder: tab.sortOrder, visible: tab.visible }
  formErrors.value = { name: '', url: '' }
  editDialogState.value = true
}

const validateForm = () => {
  let valid = true
  formErrors.value = { name: '', url: '' }
  if (!form.value.name.trim()) {
    formErrors.value.name = 'Название обязательно'
    valid = false
  } else if (form.value.name.length > 100) {
    formErrors.value.name = 'Максимум 100 символов'
    valid = false
  }
  if (!form.value.url.trim()) {
    formErrors.value.url = 'URL обязателен'
    valid = false
  } else if (!form.value.url.startsWith('/')) {
    formErrors.value.url = 'URL должен начинаться с /'
    valid = false
  } else if (form.value.url.length > 255) {
    formErrors.value.url = 'Максимум 255 символов'
    valid = false
  } else if (!/^\/[a-zA-Z0-9_\-]+(\/[a-zA-Z0-9_\-]+)*$/.test(form.value.url)) {
    formErrors.value.url = 'Допустимы только латинские буквы, цифры, дефис и подчёркивание'
    valid = false
  }
  const urlExists = localTabs.value.some(
    (t) => t.url === form.value.url && (!editingTab.value || t.id !== editingTab.value.id)
  )
  if (valid && urlExists) {
    formErrors.value.url = 'Вкладка с таким URL уже существует'
    valid = false
  }
  return valid
}

const saveTab = async () => {
  if (!validateForm()) return
  try {
    if (editingTab.value) {
      await axios.put(`tabs/${editingTab.value.id}`, form.value)
    } else {
      await axios.post('tabs', form.value)
    }
    editDialogState.value = false
    await tabsStore.invalidate()
    syncFromStore()
  } catch (e) {
    alert('Ошибка сохранения вкладки')
  }
}

// Delete
const confirmDelete = (tab) => {
  tabToDelete.value = tab
  deleteDialogState.value = true
}

const deleteTab = async () => {
  if (!tabToDelete.value) return
  const previousTabs = [...localTabs.value]
  localTabs.value = localTabs.value.filter((t) => t.id !== tabToDelete.value.id)
  try {
    await axios.delete(`tabs/${tabToDelete.value.id}`)
    deleteDialogState.value = false
    tabToDelete.value = null
    await tabsStore.invalidate()
    syncFromStore()
  } catch (e) {
    localTabs.value = previousTabs
    deleteDialogState.value = false
    alert('Ошибка удаления вкладки')
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.tabs-constructor {
  width: 100%;

  &__header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;
  }

  &__loading, &__empty {
    padding: 40px;
    text-align: center;
    color: $sc5;
    font-size: 16px;
  }

  &__list-header {
    display: grid;
    grid-template-columns: 40px 1fr 1fr 100px 100px;
    padding: 12px 16px;
    background: $pr3;
    font-weight: 600;
    font-size: 15px;
    color: $pr1;
    border: 1px solid $sc3;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    text-align: left;
  }

  &__row {
    display: grid;
    grid-template-columns: 40px 1fr 1fr 100px 100px;
    padding: 12px 16px;
    align-items: center;
    border: 1px solid $sc3;
    border-top: none;
    background: #fff;
    transition: background 0.15s;

    &:last-child { border-radius: 0 0 8px 8px; }
    &:hover { background: $pr3; }
    &--hidden { opacity: 0.5; }
  }

  &__row-name {
    font-size: 15px;
    color: $sc1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
  }
  &__row-name-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__row-badge {
    font-size: 12px;
    color: $sc2;
    font-style: italic;
    flex-shrink: 0;
  }
  &__row-url {
    font-size: 14px;
    color: $sc5;
    font-family: monospace;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__row-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  &__icon-btn {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.15s;
    display: flex;
    align-items: center;

    &:hover {
      background: $sc3;
    }

    &--delete svg path {
      transition: stroke 0.15s;
    }

    &--delete:hover svg path {
      stroke: #dc3545;
    }
  }

  &__delete-btn {
    background-color: #dc3545 !important;
    color: #fff !important;
    border-color: #dc3545 !important;
    &:hover { background-color: #c82333 !important; }
  }

  &__save-btn {
    background-color: $pr1 !important;
    color: #fff !important;
  }

  &__modal {
    padding: 24px;
    overflow-wrap: anywhere;
    h3 { margin: 0 0 20px; color: $pr1; font-size: 16px; }
    &--delete { text-align: center; }
  }

  &__modal-field {
    margin-bottom: 14px;
    label { display: block; font-size: 13px; color: $sc1; margin-bottom: 4px; font-weight: 500; }
    &--toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      label { margin-bottom: 0; }
    }
  }

  &__modal-input {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid $sc2;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    &--mono { font-family: monospace; }
  }

  &__modal-error { color: #dc3545; font-size: 12px; margin-top: 4px; display: block; }
  &__modal-warning { font-size: 13px; color: $sc5; margin-top: 4px; }

  &__modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }
}

.drag-handle {
  color: $sc2;
  font-size: 18px;
  cursor: grab;
  user-select: none;
  &:active { cursor: grabbing; }
}

.toggle {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  cursor: pointer;

  input { opacity: 0; width: 0; height: 0; }

  &__slider {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: $sc2;
    border-radius: 11px;
    transition: 0.3s;

    &::before {
      content: '';
      position: absolute;
      width: 18px; height: 18px;
      left: 2px; bottom: 2px;
      background-color: #fff;
      border-radius: 50%;
      transition: 0.3s;
    }
  }

  input:checked + &__slider { background-color: $pr1; }
  input:checked + &__slider::before { transform: translateX(18px); }
}
</style>
