import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        appEyebrow: "Patient care workspace",
        title: "Rural Health AI",
        loggedInAs: "Logged in as:",
        logout: "Logout",
        totalPatients: "Total Patients",
        highRisk: "High Risk",
        mediumRisk: "Medium Risk",
        lowRisk: "Low Risk",
        records: "Records",
        newPatient: "New patient",
        editMode: "Edit mode",
        addPatient: "Add Patient",
        updatePatient: "Update Patient",
        patientName: "Patient Name",
        age: "Age",
        gender: "Gender",
        symptoms: "Symptoms",
        symptomsLabel: "Symptoms",
        symptomsPlaceholder: "Fever, cough, headache",
        diagnosis: "Diagnosis",
        riskLevel: "Risk Level",
        search: "Search patient or symptoms",
        allPatients: "All Patients",
        noPatients: "No patients found",
        editPatient: "Edit",
        deletePatient: "Delete",
        cancel: "Cancel"
      }
    },
    hi: {
      translation: {
        appEyebrow: "रोगी देखभाल कार्यक्षेत्र",
        title: "ग्रामीण स्वास्थ्य एआई",
        loggedInAs: "लॉग इन भूमिका:",
        logout: "लॉगआउट",
        totalPatients: "कुल मरीज",
        highRisk: "उच्च जोखिम",
        mediumRisk: "मध्यम जोखिम",
        lowRisk: "कम जोखिम",
        records: "रिकॉर्ड",
        newPatient: "नया मरीज",
        editMode: "संपादन मोड",
        addPatient: "मरीज जोड़ें",
        updatePatient: "मरीज अपडेट करें",
        patientName: "मरीज का नाम",
        age: "उम्र",
        gender: "लिंग",
        symptoms: "लक्षण",
        symptomsLabel: "लक्षण",
        symptomsPlaceholder: "बुखार, खांसी, सिरदर्द",
        diagnosis: "निदान",
        riskLevel: "जोखिम स्तर",
        search: "मरीज या लक्षण खोजें",
        allPatients: "सभी मरीज",
        noPatients: "कोई मरीज नहीं मिला",
        editPatient: "संपादित करें",
        deletePatient: "हटाएं",
        cancel: "रद्द करें"
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
