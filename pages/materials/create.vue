<template>
  <div class="create-material-page">
    <div class="container create-material-page__container">
      <!-- Back Link -->
      <NuxtLink to="/" class="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Назад</span>
      </NuxtLink>

      <div class="create-card">
        <h1 class="create-card__title">Создание материала</h1>

        <form class="create-form" @submit.prevent="handleSubmit">
          <!-- Server Error Alert -->
          <div v-if="serverError" class="alert-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ serverError }}</span>
          </div>

          <!-- Title Field -->
          <div class="form-group" :class="{ 'has-error': titleError }">
            <div class="form-group__header">
              <label for="title" class="form-label">Заголовок *</label>
              <span class="char-counter" :class="{ 'is-limit': form.title.length >= 80, 'is-overflow': form.title.length > 80 }">
                {{ form.title.length }} / 80
              </span>
            </div>
            <input
              id="title"
              v-model="form.title"
              type="text"
              class="form-input"
              placeholder="Введите заголовок материала..."
              maxlength="80"
              required
              @input="validateTitle"
            />
            <span v-if="titleError" class="field-error-msg">{{ titleError }}</span>
          </div>

          <!-- Short Description Field -->
          <div class="form-group" :class="{ 'has-error': shortDescError }">
            <div class="form-group__header">
              <label for="short_description" class="form-label">Краткое описание</label>
              <span class="char-counter" :class="{ 'is-limit': form.short_description.length >= 255, 'is-overflow': form.short_description.length > 255 }">
                {{ form.short_description.length }} / 255
              </span>
            </div>
            <textarea
              id="short_description"
              v-model="form.short_description"
              class="form-textarea"
              rows="3"
              placeholder="Краткое описание материала (до 255 символов)..."
              maxlength="255"
              @input="validateShortDesc"
            ></textarea>
            <span v-if="shortDescError" class="field-error-msg">{{ shortDescError }}</span>
          </div>

          <!-- Datetime Field -->
          <div class="form-group">
            <label for="datetime" class="form-label">Дата и время публикации</label>
            <input
              id="datetime"
              v-model="localDatetime"
              type="datetime-local"
              class="form-input form-input--datetime"
              @change="updateIsoDatetime"
            />
            <span class="field-hint">По умолчанию установлены текущие дата и время</span>
          </div>

          <!-- WYSIWYG Editor Field -->
          <div class="form-group">
            <label class="form-label">Текст материала</label>
            <WysiwygEditor
              placeholder="Введите текст статьи..."
              @update:html="handleHtmlUpdate"
              @update:json="handleJsonUpdate"
            />
          </div>

          <!-- Submit Button -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn-submit"
              :disabled="isSubmitting || !isFormValid"
            >
              <span v-if="isSubmitting" class="btn-spinner"></span>
              <span>{{ isSubmitting ? 'Сохранение...' : 'Сохранить материал' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMaterialsStore } from '~/stores/materials'
import { toDatetimeLocal, fromDatetimeLocal } from '~/utils/formatDate'

useHead({
  title: 'Создание материала — Моя Планета'
})

const router = useRouter()

const materialsStore = useMaterialsStore()

// Начальное состояние формы
const form = reactive({
  title: '',
  short_description: '',
  datetime: new Date().toISOString(),
  description_html: '',
  description_json: null as any
})

// Локальное время для инпутата datetime-local
const localDatetime = ref(toDatetimeLocal())

function updateIsoDatetime() {
  form.datetime = fromDatetimeLocal(localDatetime.value)
}

// WYSIWYG handlers
function handleHtmlUpdate(html: string) {
  form.description_html = html
}

function handleJsonUpdate(json: any) {
  form.description_json = json
}

// Валидация полей
const titleError = ref('')
const shortDescError = ref('')
const serverError = ref('')
const isSubmitting = ref(false)

function validateTitle() {
  if (!form.title.trim()) {
    titleError.value = 'Заголовок обязателен для заполнения'
  } else if (form.title.length > 80) {
    titleError.value = 'Заголовок не может превышать 80 символов'
  } else {
    titleError.value = ''
  }
}

function validateShortDesc() {
  if (form.short_description.length > 255) {
    shortDescError.value = 'Краткое описание не может превышать 255 символов'
  } else {
    shortDescError.value = ''
  }
}

const isFormValid = computed(() => {
  return (
    form.title.trim().length > 0 &&
    form.title.length <= 80 &&
    form.short_description.length <= 255
  )
})

// Отправка формы
async function handleSubmit() {
  validateTitle()
  validateShortDesc()

  if (!isFormValid.value) return

  isSubmitting.value = true
  serverError.value = ''

  try {
    const saved = await materialsStore.createMaterial({
      title: form.title.trim(),
      short_description: form.short_description.trim(),
      datetime: form.datetime,
      description_html: form.description_html,
      description_json: form.description_json
    })

    // После успешного сохранения переходим на детальную страницу созданного материала
    if (saved?.id) {
      router.push(`/materials/${saved.id}`)
    } else {
      router.push('/')
    }
  } catch (err: any) {
    serverError.value = err?.data?.statusMessage || err?.message || 'Произошла ошибка при сохранении'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="less">
.create-material-page {
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-3xl);

  &__container {
    max-width: 840px;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
  padding: 6px 0;
  transition: color var(--transition-fast), transform var(--transition-fast);

  &:hover {
    color: var(--color-primary);
    transform: translateX(-3px);
  }
}

.create-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border-light);

  @media (max-width: 768px) {
    padding: var(--spacing-lg) var(--spacing-md);
    border-radius: var(--radius-lg);
  }

  &__title {
    font-family: var(--font-heading);
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: var(--spacing-xl);
  }
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  &.has-error {
    .form-input,
    .form-textarea {
      border-color: var(--color-error);

      &:focus {
        box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.15);
      }
    }
  }
}

.form-label {
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text);
}

.char-counter {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: 500;
  transition: color var(--transition-fast);

  &.is-limit {
    color: #e67e22;
    font-weight: 600;
  }

  &.is-overflow {
    color: var(--color-error);
    font-weight: 700;
  }
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  font-size: var(--font-size-base);
  border-radius: var(--radius-sm);
  box-sizing: border-box;

  &--datetime {
    max-width: 280px;
    cursor: pointer;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.field-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.field-error-msg {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  font-weight: 500;
}

.form-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: var(--spacing-md);
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: var(--color-primary);
  color: #ffffff;
  padding: 12px 32px;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--font-size-base);
  transition: background-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: 0 2px 8px rgba(0, 136, 204, 0.25);

  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
    box-shadow: 0 4px 14px rgba(0, 136, 204, 0.35);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--color-error-bg);
  border: 1px solid rgba(229, 62, 62, 0.3);
  border-radius: var(--radius-sm);
  color: var(--color-error);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
