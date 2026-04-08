<script setup lang="ts">
import type { Study } from './types'
import Thumbnail from './Thumbnail.vue'

defineOptions({ name: 'ThumbnailList' })

defineProps<{
  studies: Study[]
}>()

const activeSeriesId = defineModel<string>('activeSeriesId', { required: true })

const collapsedStudies = ref<Set<string>>(new Set())

function toggleStudy(studyId: string) {
  const s = collapsedStudies.value
  s.has(studyId) ? s.delete(studyId) : s.add(studyId)
}
</script>

<template>
  <aside class="shrink-0 bg-[var(--card)] overflow-hidden border-t border-[var(--border)] landscape:(border-t-0 border-r w-52)">
    <div class="size-full overflow-x-auto landscape:(overflow-x-hidden overflow-y-auto)">
      <div class="flex h-full landscape:(h-auto flex-col)">
        <div v-for="study in studies" :key="study.id" class="flex shrink-0 landscape:(shrink flex-col)">
          <!-- Study 头 -->
          <div
            class="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-[var(--card)] border-r border-[var(--border)] cursor-pointer select-none hover:bg-[var(--accent)]/50 landscape:(sticky top-0 z-10 border-r-0 border-b)"
            @click="toggleStudy(study.id)"
          >
            <div
              class="i-lucide-chevron-right w-3.5 h-3.5 shrink-0 text-[var(--muted-foreground)] transition-transform"
              :class="collapsedStudies.has(study.id) ? '' : 'rotate-90'"
            />
            <div class="min-w-0">
              <p class="text-xs font-semibold text-[var(--foreground)] whitespace-nowrap">
                {{ study.patient.name }}<span class="hidden landscape:inline"> · {{ study.patient.sex }} · {{ study.patient.age }}</span>
              </p>
              <p class="text-xs text-[var(--muted-foreground)] mt-0.5 whitespace-nowrap hidden landscape:block">
                {{ study.date }}{{ study.description ? ` · ${study.description}` : '' }}
              </p>
            </div>
          </div>

          <!-- Series 列表 -->
          <div
            v-show="!collapsedStudies.has(study.id)"
            class="flex items-center gap-1 p-1.5 landscape:(flex-col gap-0.5 py-1 px-1.5)"
          >
            <Thumbnail
              v-for="s in study.series"
              :key="s.id"
              :series="s"
              :active="activeSeriesId === s.id"
              @click="activeSeriesId = s.id"
            />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
