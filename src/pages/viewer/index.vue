<script setup lang='ts'>
import { init as csCoreInit } from '@cornerstonejs/core'

defineOptions({
  name: 'Viewer',
})

// http://ip:port/viewer?StudyInstanceUIDs=xxxx
const route = useRoute()
const studyUIDs = ref('')

onMounted(() => {
  studyUIDs.value = route.query.studyUIDs as string
  console.warn(studyUIDs.value)

  csCoreInit()
})
</script>

<template>
  <div>Viewer {{ studyUIDs }}</div>
</template>

<style lang='scss' scoped>

</style>
