import type { Study } from './types'

const demoStudies: Study[] = [
  {
    id: 'study-1',
    date: '2024-01-15',
    description: 'CT 胸腹部',
    patient: { name: '张三', sex: '男', age: '45岁' },
    series: [
      { id: '1-1', modality: 'CT', number: 1, desc: '胸部平扫', count: 320 },
      { id: '1-2', modality: 'CT', number: 2, desc: '腹部增强', count: 256 },
      { id: '1-3', modality: 'CT', number: 3, count: 128 },
    ],
  },
]

export function useStudies(initialStudies?: Study[]) {
  const studies = ref<Study[]>(initialStudies ?? demoStudies)
  const activeSeriesId = ref<string>(studies.value[0]?.series[0]?.id ?? '')

  return { studies, activeSeriesId }
}
