<script setup lang="ts">
import type { Series } from './types'

defineOptions({ name: 'Thumbnail' })

const props = defineProps<{
  series: Series
  active?: boolean
}>()

defineEmits<{
  click: []
}>()

const label = computed(() => props.series.desc || `Series ${props.series.number}`)
</script>

<template>
  <div
    class="shrink-0 flex items-center p-1 rd-md cursor-pointer transition-colors select-none landscape:(w-full gap-2.5 px-2 py-2)"
    :class="active
      ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
      : 'hover:bg-[var(--accent)]'"
    @click="$emit('click')"
  >
    <!-- 缩略图占位 -->
    <div class="w-10 h-10 shrink-0 rd bg-[var(--muted)] flex items-center justify-center">
      <div class="i-lucide-image w-4 h-4 text-[var(--muted-foreground)]" />
    </div>
    <!-- 序列信息（横屏才显示） -->
    <div class="hidden landscape:block flex-1 min-w-0">
      <p class="text-xs font-medium text-[var(--foreground)] truncate">
        {{ label }}
      </p>
      <p class="text-xs text-[var(--muted-foreground)] mt-0.5">
        <span class="font-mono">{{ series.modality }}</span>
        &nbsp;·&nbsp;{{ series.count }} 帧
      </p>
    </div>
  </div>
</template>
