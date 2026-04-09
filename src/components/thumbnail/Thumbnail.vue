<script setup lang="ts">
import type { Series } from '@/types/dicom'

defineOptions({ name: 'Thumbnail' })

const props = defineProps<{
  series: Series
  active?: boolean
}>()

defineEmits<{
  click: []
}>()

const label = computed(() => props.series.seriesDescription || `Series ${props.series.seriesNumber ?? '-'}`)
</script>

<template>
  <div
    class="h-full aspect-square shrink-0 flex items-center justify-center p-1 rd-md cursor-pointer transition-colors select-none landscape:(w-full h-auto aspect-auto justify-start gap-2.5 px-2 py-2)"
    :class="active
      ? 'bg-[var(--p-primary-color)] text-[var(--p-primary-contrast-color)]'
      : 'text-[var(--p-text-color)] hover:bg-[var(--p-content-border-color)]'"
    @click="$emit('click')"
  >
    <!-- 缩略图占位 -->
    <div class="size-full shrink-0 rd bg-[var(--p-content-border-color)] flex items-center justify-center landscape:(h-10 w-10)">
      <div class="i-lucide-image h-5 w-5 text-[var(--p-text-muted-color)] landscape:(h-4 w-4)" />
    </div>
    <div class="hidden min-w-0 flex-1 landscape:block">
      <p class="text-xs font-medium truncate">
        {{ label }}
      </p>
      <p class="mt-0.5 text-xs text-[var(--p-text-muted-color)]">
        <span class="font-mono">{{ series.modality || '--' }}</span>
        &nbsp;·&nbsp;{{ series.numberOfInstances ?? 0 }} 张
      </p>
    </div>
  </div>
</template>
