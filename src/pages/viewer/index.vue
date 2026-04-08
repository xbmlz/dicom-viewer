<script setup lang='ts'>
import { init as csCoreInit } from '@cornerstonejs/core'
import dcmjs from 'dcmjs'
import { getSeries } from '@/api/qido'

defineOptions({
  name: 'Viewer',
})

const { DicomMetaDictionary } = dcmjs.data

// http://ip:port/viewer?StudyInstanceUIDs=xxxx
const route = useRoute()
const studyUIDs = ref('')

onMounted(() => {
  studyUIDs.value = route.query.studyUIDs as string
  console.warn(studyUIDs.value)
  const series = getSeries(studyUIDs.value)
  console.warn('[QIDO] series:', series)

  const naturalized = DicomMetaDictionary.naturalizeDataset(series[0])
  console.warn('naturalized:', naturalized)
  csCoreInit()
})
</script>

<template>
  <div>Viewer {{ studyUIDs }}</div>
</template>

<style lang='scss' scoped>

</style>
