export interface BundlePhobiaResponse {
  name: string
  version: string
  size: number
  gzip: number
  dependencyCount: number
  hasJSModule: boolean
  hasSideEffects: boolean
}