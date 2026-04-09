<script setup lang='ts'>
import type { SubMenu } from '@/components/toolbar/ToolButton.vue'
import type { Series, Study } from '@/types/dicom'
import ThumbnailList from '@/components/thumbnail/ThumbnailList.vue'
import ToolButton from '@/components/toolbar/ToolButton.vue'
import { isDark, toggleDark } from '@/composables/dark'

defineOptions({
  name: 'Index',
})

interface StudyWithSeries extends Study {
  series: Series[]
}

const activeTool = ref('window')
const activeSeriesId = ref(102)

const studies = ref<StudyWithSeries[]>([
  {
    id: 1,
    studyId: 'STUDY-001',
    studyInstanceUid: '1.2.840.10008.1.2.1.study.001',
    studyDate: '2026-04-09',
    studyTime: '09:42:00',
    studyDescription: 'CT Chest Without Contrast',
    accessionNumber: 'ACC-20260409-01',
    patientId: 'P103829',
    patientName: 'Zhang San',
    patientBirthDate: '1980-01-16',
    patientSex: 'M',
    modality: 'CT',
    manufacturer: 'SIEMENS',
    institutionName: 'OpenAI Medical Center',
    numberOfSeries: 3,
    numberOfInstances: 448,
    createdAt: '2026-04-09T09:42:00Z',
    updatedAt: '2026-04-09T09:42:00Z',
    series: [
      {
        id: 101,
        studyInstanceUid: '1.2.840.10008.1.2.1.study.001',
        seriesInstanceUid: '1.2.840.10008.1.2.1.series.001',
        seriesNumber: 1,
        seriesDate: '2026-04-09',
        seriesTime: '09:43:00',
        seriesDescription: 'Scout',
        modality: 'CT',
        bodyPartExamined: 'CHEST',
        numberOfInstances: 4,
        createdAt: '2026-04-09T09:43:00Z',
        updatedAt: '2026-04-09T09:43:00Z',
      },
      {
        id: 102,
        studyInstanceUid: '1.2.840.10008.1.2.1.study.001',
        seriesInstanceUid: '1.2.840.10008.1.2.1.series.002',
        seriesNumber: 2,
        seriesDate: '2026-04-09',
        seriesTime: '09:44:00',
        seriesDescription: 'Axial Lung',
        modality: 'CT',
        bodyPartExamined: 'CHEST',
        numberOfInstances: 356,
        createdAt: '2026-04-09T09:44:00Z',
        updatedAt: '2026-04-09T09:44:00Z',
      },
      {
        id: 103,
        studyInstanceUid: '1.2.840.10008.1.2.1.study.001',
        seriesInstanceUid: '1.2.840.10008.1.2.1.series.003',
        seriesNumber: 3,
        seriesDate: '2026-04-09',
        seriesTime: '09:45:00',
        seriesDescription: 'Coronal MPR',
        modality: 'CT',
        bodyPartExamined: 'CHEST',
        numberOfInstances: 88,
        createdAt: '2026-04-09T09:45:00Z',
        updatedAt: '2026-04-09T09:45:00Z',
      },
    ],
  },
  {
    id: 2,
    studyId: 'STUDY-002',
    studyInstanceUid: '1.2.840.10008.1.2.1.study.002',
    studyDate: '2026-04-08',
    studyTime: '14:10:00',
    studyDescription: 'MR Brain Routine',
    accessionNumber: 'ACC-20260408-02',
    patientId: 'P204556',
    patientName: 'Li Si',
    patientBirthDate: '1991-07-09',
    patientSex: 'F',
    modality: 'MR',
    manufacturer: 'GE',
    institutionName: 'OpenAI Medical Center',
    numberOfSeries: 2,
    numberOfInstances: 412,
    createdAt: '2026-04-08T14:10:00Z',
    updatedAt: '2026-04-08T14:10:00Z',
    series: [
      {
        id: 201,
        studyInstanceUid: '1.2.840.10008.1.2.1.study.002',
        seriesInstanceUid: '1.2.840.10008.1.2.1.series.004',
        seriesNumber: 1,
        seriesDate: '2026-04-08',
        seriesTime: '14:11:00',
        seriesDescription: 'Ax T1',
        modality: 'MR',
        bodyPartExamined: 'BRAIN',
        numberOfInstances: 186,
        createdAt: '2026-04-08T14:11:00Z',
        updatedAt: '2026-04-08T14:11:00Z',
      },
      {
        id: 202,
        studyInstanceUid: '1.2.840.10008.1.2.1.study.002',
        seriesInstanceUid: '1.2.840.10008.1.2.1.series.005',
        seriesNumber: 2,
        seriesDate: '2026-04-08',
        seriesTime: '14:14:00',
        seriesDescription: 'Ax FLAIR',
        modality: 'MR',
        bodyPartExamined: 'BRAIN',
        numberOfInstances: 226,
        createdAt: '2026-04-08T14:14:00Z',
        updatedAt: '2026-04-08T14:14:00Z',
      },
    ],
  },
])

function activateTool(toolId: string) {
  activeTool.value = toolId
}

const measureMenu = computed<SubMenu>(() => ({
  type: 'radio',
  items: [
    {
      id: 'length',
      label: 'Length',
      icon: 'i-lucide-ruler',
      shortcut: 'L',
      checked: activeTool.value === 'length',
      onClick: () => activateTool('length'),
    },
    {
      id: 'angle',
      label: 'Angle',
      icon: 'i-lucide-triangle-right',
      shortcut: 'A',
      checked: activeTool.value === 'angle',
      onClick: () => activateTool('angle'),
    },
  ],
}))
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden text-[var(--text-color)]">
    <header class="shrink-0 border-b border-[var(--p-content-border-color)] px-4 py-2">
      <div class="flex flex-wrap items-center gap-2">
        <ToolButton
          icon="i-lucide-mouse-pointer-2"
          label="Select"
          :active="activeTool === 'select'"
          @click="activateTool('select')"
        />
        <ToolButton
          icon="i-lucide-hand"
          label="Pan"
          :active="activeTool === 'pan'"
          @click="activateTool('pan')"
        />
        <ToolButton
          icon="i-lucide-circle-dot"
          label="Window"
          :active="activeTool === 'window'"
          @click="activateTool('window')"
        />
        <ToolButton
          icon="i-lucide-ruler"
          label="Measure"
          :active="['length', 'angle'].includes(activeTool)"
          :submenu="measureMenu"
          @click="activateTool(activeTool)"
        />
        <ToolButton
          :icon="isDark ? 'i-lucide-moon-star' : 'i-lucide-sun-medium'"
          label="Theme"
          @click="toggleDark()"
        />
      </div>
    </header>

    <main class="flex min-h-0 flex-1 flex-col landscape:flex-row">
      <section class="order-2 h-32 shrink-0 border-t border-[var(--p-content-border-color)] landscape:(order-1 h-auto w-72 border-r border-t-0)">
        <ThumbnailList v-model:active-series-id="activeSeriesId" :studies="studies" />
      </section>

      <section class="order-1 min-h-0 flex-1 border-b border-[var(--p-content-border-color)] landscape:(order-2 border-b-0)">
        <div class="flex h-full items-center justify-center text-sm text-[var(--p-text-muted-color)]">
          Viewport
        </div>
      </section>
    </main>
  </div>
</template>
