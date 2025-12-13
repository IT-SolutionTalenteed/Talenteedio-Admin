export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    // Utiliser une notification simple avec alert pour l'instant
    // Dans un vrai projet, on utiliserait une librairie comme vue-toastification
    if (type === 'error') {
      alert(`❌ ${message}`)
    } else if (type === 'success') {
      alert(`✅ ${message}`)
    } else if (type === 'warning') {
      alert(`⚠️ ${message}`)
    } else {
      alert(`ℹ️ ${message}`)
    }
  }

  return {
    showToast
  }
}