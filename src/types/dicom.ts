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
/**
 * 0020000D: StudyInstanceUID
 * 0008103E: SeriesDescription
 * 00200011: SeriesNumber
 * 0020000E: SeriesInstanceUID
 * 00080060: Modality
 * 00080021: SeriesDate
 * 00080031: SeriesTime
 * 00080005: SpecificCharacterSet
 * 00080070: Manufacturer
 * 00080090: ReferringPhysicianName
 * 00081090: ManufacturerModelName
 * 00180015: BodyPartExamined
 * 00181030: ProtocolName
 */
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
