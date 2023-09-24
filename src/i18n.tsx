import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import base from "./utils/common.json";

const resources = {
  en: {
    translation: base,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: "en",
});

export default i18next;
