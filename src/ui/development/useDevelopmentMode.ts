import { readonly, ref } from 'vue'
import { DEVELOPMENT_MODE } from '../../config/environment'

const developmentMode = ref(DEVELOPMENT_MODE)

export function useDevelopmentMode() {
  function toggleDevelopmentMode() {
    developmentMode.value = !developmentMode.value
  }

  return {
    developmentMode: readonly(developmentMode),
    toggleDevelopmentMode,
  }
}
