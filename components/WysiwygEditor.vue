<template>
  <div class="wysiwyg-editor">
    <!-- Toolbar -->
    <div v-if="editor" class="wysiwyg-editor__toolbar">
      <button
        type="button"
        class="toolbar-btn"
        :class="{ 'is-active': editor.isActive('paragraph') }"
        title="Обычный текст"
        @click="editor.chain().focus().setParagraph().run()"
      >
        <span class="toolbar-btn__text">Текст</span>
      </button>

      <button
        type="button"
        class="toolbar-btn"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        title="Заголовок 1"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        <span class="toolbar-btn__text">H1</span>
      </button>

      <button
        type="button"
        class="toolbar-btn"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        title="Заголовок 2"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <span class="toolbar-btn__text">H2</span>
      </button>

      <button
        type="button"
        class="toolbar-btn"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        title="Заголовок 3"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <span class="toolbar-btn__text">H3</span>
      </button>

      <button
        type="button"
        class="toolbar-btn"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        title="Цитата"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        <span class="toolbar-btn__text">Цитата</span>
      </button>
    </div>

    <!-- Content Area -->
    <div class="wysiwyg-editor__content">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{
  initialContent?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:html', html: string): void
  (e: 'update:json', json: any): void
}>()

const editor = useEditor({
  content: props.initialContent || '',
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      }
    }),
    Placeholder.configure({
      placeholder: props.placeholder || 'Введите текст материала...'
    })
  ],
  onUpdate: ({ editor }) => {
    emit('update:html', editor.getHTML())
    emit('update:json', editor.getJSON())
  }
})

// При размонтировании уничтожаем экземпляр TipTap
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped lang="less">
.wysiwyg-editor {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  display: flex;
  flex-direction: column;

  &:focus-within {
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px rgba(0, 136, 204, 0.15);
  }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-border-light);
    border-top-left-radius: var(--radius-sm);
    border-top-right-radius: var(--radius-sm);
  }

  &__content {
    padding: 16px;
    min-height: 220px;
    cursor: text;

    :deep(.tiptap) {
      outline: none;
      min-height: 200px;
      font-family: var(--font-body);
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
      color: var(--color-text);

      p {
        margin-bottom: 1em;
      }

      h1, h2, h3 {
        font-family: var(--font-heading);
        font-weight: 700;
        margin-top: 1.2em;
        margin-bottom: 0.5em;
      }

      h1 { font-size: 1.8rem; }
      h2 { font-size: 1.5rem; }
      h3 { font-size: 1.25rem; }

      blockquote {
        margin: 1em 0;
        padding-left: 14px;
        border-left: 3px solid var(--color-primary);
        font-style: italic;
        color: var(--color-text-secondary);
      }

      // Placeholder style
      p.is-editor-empty:first-child::before {
        color: var(--color-text-muted);
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
      }
    }
  }
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: var(--radius-xs);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);

  &:hover {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
    border-color: var(--color-primary);
  }

  &.is-active {
    background-color: var(--color-primary);
    color: #ffffff;
    border-color: var(--color-primary);
  }
}
</style>
