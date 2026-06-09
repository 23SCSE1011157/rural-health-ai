import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Login from "./pages/Login";

function App() {

  const { t, i18n } = useTranslation();

  // FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    symptoms: ""
  });

  // PATIENT LIST
  const [patients, setPatients] = useState([]);

  // SEARCH
  const [search, setSearch] = useState("");

  // EDIT MODE
  const [editId, setEditId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("token")
);
const role =
  localStorage.getItem("role");

  // DASHBOARD COUNTS
  const totalPatients = patients.length;

  const highRiskPatients =
    patients.filter(
      (patient) => patient.riskLevel === "High"
    ).length;

  const mediumRiskPatients =
    patients.filter(
      (patient) => patient.riskLevel === "Medium"
    ).length;

  const lowRiskPatients =
    patients.filter(
      (patient) => patient.riskLevel === "Low"
    ).length;

  // SEARCH FILTER
  const filteredPatients = patients.filter((patient) => {

    
    return (

      patient.name
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      patient.symptoms.join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())

    );

  });

  // FETCH PATIENTS
  const fetchPatients = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/patients"
      );

      setPatients(res.data.patients);

    } catch (error) {

      console.log(error);

    }

  };

  // LOAD DATA
  useEffect(() => {

    fetchPatients();

  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // DELETE PATIENT
  const deletePatient = async (id) => {

    try {

      const response = await axios.delete(
        `http://localhost:5000/api/patients/${id}`
      );

      alert(response.data.message);

      fetchPatients();

    } catch (error) {

      console.log(error);

      alert("Error deleting patient");

    }

  };

  // EDIT PATIENT
  const editPatient = (patient) => {

    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      symptoms: patient.symptoms.join(", ")
    });

    setEditId(patient._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // UPDATE PATIENT
      if (editId) {

        const response = await axios.put(
          `http://localhost:5000/api/patients/${editId}`,
          {
            ...formData,
            symptoms: formData.symptoms
              .split(",")
              .map((item) => item.trim())
          }
        );

        alert(response.data.message);

        setEditId(null);

      }

      // ADD PATIENT
      else {

        const response = await axios.post(
          "http://localhost:5000/api/patients/add",
          {
            ...formData,
            symptoms: formData.symptoms
              .split(",")
              .map((item) => item.trim())
          }
        );

        alert(response.data.message);

      }

      // REFRESH DATA
      fetchPatients();

      // CLEAR FORM
      setFormData({
        name: "",
        age: "",
        gender: "",
        symptoms: ""
      });

    } catch (error) {

      console.log(error);

      // OFFLINE SAVE
      const offlinePatients =
        JSON.parse(localStorage.getItem("offlinePatients")) || [];

      offlinePatients.push({
        ...formData,
        symptoms: formData.symptoms.split(","),
        offline: true
      });

      localStorage.setItem(
        "offlinePatients",
        JSON.stringify(offlinePatients)
      );

      alert(
        "No internet/server issue. Patient saved offline."
      );

    }

  };
   if (!isLoggedIn) {

    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
      />
    );

  }

  return (

    <div
      style={{
        padding: "40px",
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial"
      }}
    >

      {/* LANGUAGE BUTTONS */}

      <div style={{ marginBottom: "20px" }}>

        <button
          onClick={() => i18n.changeLanguage("en")}
          style={{
            marginRight: "10px",
            padding: "8px 15px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer"
          }}
        >
          English
        </button>

        <button
          onClick={() => i18n.changeLanguage("hi")}
          style={{
            padding: "8px 15px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer"
          }}
        >
          हिंदी
        </button>

      </div>

      {/* TITLE */}

      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  }}
>

  <h1>{t("title")}</h1>

  <button
    onClick={() => {

      localStorage.removeItem("token");
localStorage.removeItem("role");

      window.location.reload();

    }}
    style={{
      padding: "10px 20px",
      backgroundColor: "red",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    Logout
  </button>

</div>
    <p
  style={{
    color: "#60a5fa",
    marginBottom: "20px"
  }}
>
  Logged in as: {role}
</p>

      {/* DASHBOARD */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "40px"
        }}
      >

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
            width: "200px"
          }}
        >
          <h3>{t("totalPatients")}</h3>
          <h1>{totalPatients}</h1>
        </div>

        <div
          style={{
            background: "#7f1d1d",
            padding: "20px",
            borderRadius: "10px",
            width: "200px"
          }}
        >
          <h3>{t("highRisk")}</h3>
          <h1>{highRiskPatients}</h1>
        </div>

        <div
          style={{
            background: "#78350f",
            padding: "20px",
            borderRadius: "10px",
            width: "200px"
          }}
        >
          <h3>{t("mediumRisk")}</h3>
          <h1>{mediumRiskPatients}</h1>
        </div>

        <div
          style={{
            background: "#14532d",
            padding: "20px",
            borderRadius: "10px",
            width: "200px"
          }}
        >
          <h3>{t("lowRisk")}</h3>
          <h1>{lowRiskPatients}</h1>
        </div>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder={t("search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "12px",
          width: "350px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "none"
        }}
      />

      <br /><br />

      {/* FORM */}

{
  (role === "admin" || role === "worker") && (

    <form onSubmit={handleSubmit}>

      <input
        type="text"
        name="name"
        placeholder={t("patientName")}
        value={formData.name}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "5px",
          border: "none"
        }}
      />

      <br /><br />

      <input
        type="number"
        name="age"
        placeholder={t("age")}
        value={formData.age}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "5px",
          border: "none"
        }}
      />

      <br /><br />

      <input
        type="text"
        name="gender"
        placeholder={t("gender")}
        value={formData.gender}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "5px",
          border: "none"
        }}
      />

      <br /><br />

      <input
        type="text"
        name="symptoms"
        placeholder={t("symptoms")}
        value={formData.symptoms}
        onChange={handleChange}
        required
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "5px",
          border: "none"
        }}
      />

      <br /><br />

      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: editId ? "orange" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {editId ? t("updatePatient") : t("addPatient")}
      </button>

    </form>

  )
}
      <hr style={{ margin: "40px 0" }} />

      {/* PATIENT LIST */}

      <h2>{t("allPatients")}</h2>

      {
        filteredPatients.length === 0 ? (

          <p>{t("noPatients")}</p>

        ) : (

          filteredPatients.map((patient) => (

            <div
              key={patient._id}
              style={{
                border: "1px solid gray",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px",
                backgroundColor: "#1e293b"
              }}
            >

              <h3>{patient.name}</h3>

              <p>
                <strong>{t("age")}:</strong> {patient.age}
              </p>

              <p>
                <strong>{t("gender")}:</strong> {patient.gender}
              </p>

              <p>
                <strong>{t("symptoms")}:</strong>{" "}
                {patient.symptoms.join(", ")}
              </p>

              <p>
                <strong>{t("riskLevel")}:</strong>{" "}
                {patient.riskLevel}
              </p>

              <p>
                <strong>{t("diagnosis")}:</strong>{" "}
                {patient.diagnosis}
              </p>

              {/* BUTTONS */}

              <div style={{ marginTop: "15px" }}>

               {
  role === "admin" && (

    <button
      onClick={() => editPatient(patient)}
      style={{
        marginRight: "10px",
        padding: "8px 15px",
        backgroundColor: "#f59e0b",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}
    >
      {t("editPatient")}
    </button>

  )
}

               {
  role === "admin" && (

    <button
      onClick={() => deletePatient(patient._id)}
      style={{
        padding: "8px 15px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}
    >
      {t("deletePatient")}
    </button>

  )
}

              </div>

            </div>

          ))

        )
      }

    </div>

  );

}

export default App;