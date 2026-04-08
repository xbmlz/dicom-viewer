export interface Series {
  id: string
  modality: string
  number: number
  desc?: string
  count: number
}

export interface Study {
  id: string
  date: string
  description?: string
  patient: { name: string, sex: string, age: string }
  series: Series[]
}
