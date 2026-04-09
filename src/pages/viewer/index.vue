<script setup lang='ts'>
import type { Series } from '@/types/dicom'
import { init as csCoreInit } from '@cornerstonejs/core'
import { useToast } from 'primevue/usetoast'

defineOptions({
  name: 'Viewer',
})

const toast = useToast()

// http://ip:port/viewer?StudyInstanceUIDs=xxxx
const route = useRoute()
const studyUIDs = ref('')

onMounted(async () => {
  studyUIDs.value = route.query.studyUIDs as string
  console.warn(studyUIDs.value)

  // 使用 useFetch 获取 series 数据
  const { data, error } = await useFetch<Series>(`/dicomweb/studies/${studyUIDs.value}/series`)
  console.warn(data.value)
  if (error.value) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: 'Failed to fetch series data', life: 3000 })
    return
  }
  csCoreInit()
})
</script>

<template>
  <div>Viewer {{ studyUIDs }}</div>
</template>

<style lang='scss' scoped>

</style>
