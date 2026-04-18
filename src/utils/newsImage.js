import logoImg from '@/assets/img/logo.jpg'
import { API_FILES_URL, NO_IMG_URL } from '@/main'

export { logoImg }

const isPlaceholder = (imageLink) => !imageLink || imageLink === NO_IMG_URL

export const newsImageSrc = (imageLink) => {
  if (isPlaceholder(imageLink)) return logoImg
  return `${API_FILES_URL}/${imageLink}`
}

export const isNewsPlaceholder = isPlaceholder
