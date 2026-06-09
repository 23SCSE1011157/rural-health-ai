const predictRiskAndDiagnosis = (symptoms) => {

  const symptomText = symptoms.join(" ").toLowerCase();

  // DEFAULT VALUES
  let riskLevel = "Low";
  let diagnosis = "General Checkup Needed";

  // HIGH RISK
  if (
    symptomText.includes("chest pain") ||
    symptomText.includes("breathing problem") ||
    symptomText.includes("heart")
  ) {

    riskLevel = "High";
    diagnosis = "Possible Heart Disease";

  }

  // MEDIUM RISK
  else if (
    symptomText.includes("fever") ||
    symptomText.includes("cough")
  ) {

    riskLevel = "Medium";
    diagnosis = "Possible Viral Infection";

  }

  // VOMITING
  else if (
    symptomText.includes("vomiting")
  ) {

    riskLevel = "Medium";
    diagnosis = "Possible Food Poisoning";

  }

  // LOW RISK
  else if (
    symptomText.includes("headache")
  ) {

    riskLevel = "Low";
    diagnosis = "Mild Stress or Fatigue";

  }

  return {
    riskLevel,
    diagnosis
  };

};

module.exports = predictRiskAndDiagnosis;