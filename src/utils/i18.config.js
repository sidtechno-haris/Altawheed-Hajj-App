import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { ar, en } from "./translation";

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

i18next.use(initReactI18next).init({
  debug: false,
  lng: "en",
  compatibilityJSON: "v3",
  fallbackLng: "en",
  interpolation: {
    escapeValue: true, // not needed for react as it escapes by default
  },
  resources,
});

export default i18next;
