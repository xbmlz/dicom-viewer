export interface Study {
  id: number
  studyId: string
  studyInstanceUid: string
  studyDate?: string
  studyTime?: string
  studyDescription?: string
  accessionNumber?: string
  patientId?: string
  patientName?: string
  patientBirthDate?: string
  patientSex?: 'M' | 'F' | 'O'
  modality?: string
  manufacturer?: string
  institutionName?: string
  numberOfSeries?: number
  numberOfInstances?: number
  createdAt: string
  updatedAt: string
}

export interface Series {
  id: number
  studyInstanceUid: string
  seriesInstanceUid: string
  seriesNumber?: number
  seriesDate?: string
  seriesTime?: string
  seriesDescription?: string
  modality?: string
  bodyPartExamined?: string
  numberOfInstances?: number
  createdAt: string
  updatedAt: string
}

export interface Instance {
  id: number
  studyInstanceUid: string
  seriesInstanceUid: string
  sopInstanceUid: string
  sopClassUid?: string
  instanceNumber?: number
  contentDate?: string
  contentTime?: string
  acquisitionDate?: string
  acquisitionTime?: string
  numberOfFrames?: number
  transferSyntaxUid?: string
  filePath: string
  createdAt: string
  updatedAt: string
}
