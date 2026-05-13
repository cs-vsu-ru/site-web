import { API_FILES_URL } from "@/main";

export const fileImageSrc = (fileName) => {
  if (!fileName) return "";

  const src = String(fileName);

  if (/^(https?:|blob:|data:)/i.test(src)) {
    return encodeURI(src);
  }

  if (src.startsWith("/is/api/files/")) {
    return encodeURI(`${window.location.origin}${src}`);
  }

  return encodeURI(`${API_FILES_URL}/${src.replace(/^\/+/, "")}`);
};
