import { createPinia } from 'pinia'
import { useStudyStore } from './modules/study'

const pinia = createPinia()

export default pinia
export { useStudyStore }
