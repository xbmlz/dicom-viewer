import { api } from 'dicomweb-client'

export interface QidoSearchOptions {
  limit?: number
  offset?: number
  includeField?: string
}

const DICOMWEB_BASE = '/dicomweb'

const client = new api.DICOMwebClient({
  url: `${window.location.origin}${DICOMWEB_BASE}`,
  singlepart: false,
})

export function getStudies(options: QidoSearchOptions = {}): Record<string, unknown>[] {
  const queryParams: Record<string, string | number> = {}

  if (options.limit != null)
    queryParams.limit = options.limit

  if (options.offset != null)
    queryParams.offset = options.offset

  if (options.includeField)
    queryParams.includefield = options.includeField

  return client.searchForStudies({
    queryParams,
  })
}

export function getSeries(
  studyInstanceUID: string,
  options: QidoSearchOptions = {},
): Record<string, unknown>[] {
  const queryParams: Record<string, string | number> = {}

  if (options.limit != null)
    queryParams.limit = options.limit

  if (options.offset != null)
    queryParams.offset = options.offset

  if (options.includeField)
    queryParams.includefield = options.includeField

  return client.searchForSeries({
    studyInstanceUID,
    queryParams,
  })
}
