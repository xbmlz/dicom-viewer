<script setup lang="ts">
import type { Series, Study } from '@/types/dicom'
import Thumbnail from './Thumbnail.vue'

interface StudyWithSeries extends Study {
  series: Series[]
}

const props = defineProps<{
  studies: StudyWithSeries[]
}>()

const activeSeriesId = defineModel<number>('activeSeriesId', { required: true })

const collapsedStudies = ref<Set<string>>(new Set())

function toggleStudy(studyId: string) {
  const s = collapsedStudies.value
  s.has(studyId) ? s.delete(studyId) : s.add(studyId)
}
</script>

<template>
  <aside class="h-full w-full bg-[var(--p-content-background)] overflow-hidden border-t border-[var(--p-content-border-color)] landscape:(border-t-0 border-r)">
    <div class="size-full overflow-x-auto landscape:(overflow-x-hidden overflow-y-auto)">
      <div class="flex h-full landscape:(h-auto flex-col)">
        <div v-for="study in props.studies" :key="study.id" class="flex h-full shrink-0 landscape:(h-auto shrink flex-col)">
          <!-- Study 头 -->
          <div
            class="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-[var(--p-content-background)] border-r border-[var(--p-content-border-color)] cursor-pointer select-none hover:bg-[var(--p-content-border-color)] landscape:(sticky top-0 z-10 border-r-0 border-b)"
            @click="toggleStudy(study.studyInstanceUid)"
          >
            <div
              class="i-lucide-chevron-right w-3.5 h-3.5 shrink-0 text-[var(--p-text-muted-color)] transition-transform"
              :class="collapsedStudies.has(study.studyInstanceUid) ? '' : 'rotate-90'"
            />
            <div class="min-w-0">
              <p class="text-xs font-semibold whitespace-nowrap">
                {{ study.patientName || 'Unknown Patient' }}
                <span class="hidden landscape:inline">
                  · {{ study.patientSex || '-' }}
                  · {{ study.patientId || '-' }}
                </span>
              </p>
              <p class="mt-0.5 hidden truncate text-xs text-[var(--p-text-muted-color)] landscape:block">
                {{ study.modality || '--' }} · {{ study.series.length }} series
                <span class="truncate">
                  {{ study.studyDate || '-' }}{{ study.studyDescription ? ` · ${study.studyDescription}` : '' }}
                </span>
              </p>
            </div>
          </div>

          <!-- Series 列表 -->
          <div
            v-show="!collapsedStudies.has(study.studyInstanceUid)"
            class="flex h-full items-center gap-1 p-1.5 landscape:(h-auto flex-col gap-0.5 py-1 px-1.5)"
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
