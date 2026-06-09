import i18n from "i18next";

import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({

  resources: {

    en: {

      translation: {

        title: "Rural Health AI",
        addPatient: "Add Patient",
        patientName: "Patient Name",
        age: "Age",
        gender: "Gender",
        symptoms: "Symptoms separated by comma",
        search: "Search patient or symptoms"

      }

    },

    hi: {

      translation: {

        title: "ग्रामीण स्वास्थ्य एआई",
        addPatient: "मरीज जोड़ें",
        patientName: "मरीज का नाम",
        age: "उम्र",
        gender: "लिंग",
        symptoms: "लक्षण कॉमा से अलग करें",
        search: "मरीज या लक्षण खोजें"

      }

    }

  },

  lng: "en",

  fallbackLng: "en",

  interpolation: {
    escapeValue: false
  }

});

export default i18n;