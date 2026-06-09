const express = require("express");
const router = express.Router();

const Patient = require("../models/Patient");
const predictRiskAndDiagnosis = require("../utils/riskPredictor");


// ADD PATIENT
router.post("/add", async (req, res) => {

  try {

    const aiResult = predictRiskAndDiagnosis(req.body.symptoms);

const patient = new Patient({
  ...req.body,
  riskLevel: aiResult.riskLevel,
  diagnosis: aiResult.diagnosis
});

    await patient.save();

    res.status(201).json({
      success: true,
      message: "Patient Added Successfully",
      patient
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});


// GET ALL PATIENTS
router.get("/", async (req, res) => {

  try {

    const patients = await Patient.find();

    res.status(200).json({
      success: true,
      patients
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

// DELETE PATIENT

router.delete("/:id", async (req, res) => {

  try {

    await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Patient Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

// UPDATE PATIENT
router.put("/:id", async (req, res) => {

  try {

    const updatedPatient =
      await Patient.findByIdAndUpdate(

        req.params.id,

        req.body,

        { new: true }

      );

    res.json({
      success: true,
      message: "Patient Updated Successfully",
      patient: updatedPatient
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});
module.exports = router;