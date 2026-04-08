<script setup lang="ts">
defineOptions({ name: 'UiDialog' })

const props = withDefaults(defineProps<{
  modelValue?: boolean
  title?: string
  width?: string
  persistent?: boolean
}>(), {
  modelValue: false,
  width: '560px',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const open = useVModel(props, 'modelValue', emit)

function close() {
  if (!props.persistent)
    open.value = false
}

onKeyStroke('Escape', () => {
  if (open.value)
    close()
})
useScrollLock(computed(() => open.value ? document.body : null))
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="open"
        class="fixed inset-0 z-100 fcc"
        aria-modal="true"
        role="dialog"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="close" />

        <!-- Panel -->
        <div
          class="dialog-panel relative flex flex-col bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] rd-lg shadow-2xl overflow-hidden max-h-[85vh]"
          :style="{ width: props.width, maxWidth: 'calc(100vw - 2rem)' }"
        >
          <!-- Header -->
          <div v-if="title || $slots.header" class="shrink-0 flex items-center h-12 px-5 border-b border-[var(--border)]">
            <slot name="header">
              <h2 class="flex-1 text-sm font-semibold text-[var(--foreground)] truncate">
                {{ title }}
              </h2>
            </slot>
            <button
              class="fcc w-7 h-7 -mr-1.5 rd-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--accent)] cursor-pointer transition-colors"
              title="关闭"
              @click="open = false"
            >
              <div class="i-lucide-x w-4 h-4" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-5 py-4">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="shrink-0 flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--border)]">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}

.dialog-enter-active .dialog-panel,
.dialog-leave-active .dialog-panel {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog-panel {
  opacity: 0;
  transform: translateY(-12px) scale(0.97);
}

.dialog-leave-to .dialog-panel {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
</style>
