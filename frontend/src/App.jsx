import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Login from "./pages/Login";

const API_BASE_URL = "http://localhost:5000/api";

const emptyForm = {
  name: "",
  age: "",
  gender: "",
  symptoms: ""
};

const getSymptomsText = (symptoms) => {
  if (Array.isArray(symptoms)) {
    return symptoms.join(", ");
  }

  return symptoms || "";
};

const getRiskClassName = (riskLevel) => {
  const level = (riskLevel || "Low").toLowerCase();

  if (level === "high") {
    return "risk-high";
  }

  if (level === "medium") {
    return "risk-medium";
  }

  return "risk-low";
};

const formatRole = (role) => {
  if (!role) {
    return "Guest";
  }

  return role.charAt(0).toUpperCase() + role.slice(1);
};

const fetchPatients = async () => {
  const res = await axios.get(`${API_BASE_URL}/patients`);
  return res.data.patients;
};

function App() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState(emptyForm);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const totalPatients = patients.length;
  const highRiskPatients = patients.filter((patient) => patient.riskLevel === "High").length;
  const mediumRiskPatients = patients.filter((patient) => patient.riskLevel === "Medium").length;
  const lowRiskPatients = patients.filter((patient) => patient.riskLevel === "Low").length;

  const canAddPatient = role === "admin" || role === "worker";
  const canManagePatient = role === "admin";

  const filteredPatients = patients.filter((patient) => {
    const patientName = patient.name?.toLowerCase() || "";
    const symptoms = getSymptomsText(patient.symptoms).toLowerCase();
    const searchTerm = search.toLowerCase();

    return patientName.includes(searchTerm) || symptoms.includes(searchTerm);
  });

  const refreshPatients = async () => {
    try {
      const nextPatients = await fetchPatients();
      setPatients(nextPatients);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let isActive = true;

    if (isLoggedIn) {
      const loadPatients = async () => {
        try {
          const nextPatients = await fetchPatients();

          if (isActive) {
            setPatients(nextPatients);
          }
        } catch (error) {
          console.log(error);
        }
      };

      loadPatients();
    }

    return () => {
      isActive = false;
    };
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setRole(localStorage.getItem("role") || "");
    setIsLoggedIn(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditId(null);
  };

  const deletePatient = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/patients/${id}`);
      alert(response.data.message);
      refreshPatients();
    } catch (error) {
      console.log(error);
      alert("Error deleting patient");
    }
  };

  const editPatient = (patient) => {
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      symptoms: getSymptomsText(patient.symptoms)
    });

    setEditId(patient._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const patientPayload = {
      ...formData,
      symptoms: formData.symptoms
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    try {
      if (editId) {
        const response = await axios.put(`${API_BASE_URL}/patients/${editId}`, patientPayload);
        alert(response.data.message);
      } else {
        const response = await axios.post(`${API_BASE_URL}/patients/add`, patientPayload);
        alert(response.data.message);
      }

      refreshPatients();
      resetForm();
    } catch (error) {
      console.log(error);

      const offlinePatients = JSON.parse(localStorage.getItem("offlinePatients")) || [];
      offlinePatients.push({
        ...patientPayload,
        offline: true
      });

      localStorage.setItem("offlinePatients", JSON.stringify(offlinePatients));
      alert("No internet/server issue. Patient saved offline.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole("");
    setPatients([]);
    resetForm();
  };

  if (!isLoggedIn) {
    return <Login setIsLoggedIn={handleLoginSuccess} />;
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">{t("appEyebrow")}</p>
          <h1>{t("title")}</h1>
          <p className="muted-text">
            {t("loggedInAs")} <strong>{formatRole(role)}</strong>
          </p>
        </div>

        <div className="top-actions">
          <div className="language-toggle" aria-label="Language">
            <button
              type="button"
              className={i18n.language === "en" ? "active" : ""}
              onClick={() => i18n.changeLanguage("en")}
            >
              English
            </button>
            <button
              type="button"
              className={i18n.language === "hi" ? "active" : ""}
              onClick={() => i18n.changeLanguage("hi")}
            >
              Hindi
            </button>
          </div>

          <button className="secondary-button" type="button" onClick={handleLogout}>
            {t("logout")}
          </button>
        </div>
      </header>

      <section className="dashboard-grid" aria-label="Patient summary">
        <article className="stat-card">
          <span>{t("totalPatients")}</span>
          <strong>{totalPatients}</strong>
        </article>
        <article className="stat-card risk-high">
          <span>{t("highRisk")}</span>
          <strong>{highRiskPatients}</strong>
        </article>
        <article className="stat-card risk-medium">
          <span>{t("mediumRisk")}</span>
          <strong>{mediumRiskPatients}</strong>
        </article>
        <article className="stat-card risk-low">
          <span>{t("lowRisk")}</span>
          <strong>{lowRiskPatients}</strong>
        </article>
      </section>

      <section className="workspace-grid">
        {canAddPatient && (
          <form className="panel patient-form" onSubmit={handleSubmit}>
            <div className="section-heading">
              <p className="eyebrow">{editId ? t("editMode") : t("newPatient")}</p>
              <h2>{editId ? t("updatePatient") : t("addPatient")}</h2>
            </div>

            <label>
              {t("patientName")}
              <input
                type="text"
                name="name"
                placeholder={t("patientName")}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <div className="form-row">
              <label>
                {t("age")}
                <input
                  type="number"
                  name="age"
                  placeholder={t("age")}
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </label>

              <label>
                {t("gender")}
                <input
                  type="text"
                  name="gender"
                  placeholder={t("gender")}
                  value={formData.gender}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              {t("symptoms")}
              <textarea
                name="symptoms"
                placeholder={t("symptomsPlaceholder")}
                value={formData.symptoms}
                onChange={handleChange}
                required
                rows="4"
              />
            </label>

            <div className="form-actions">
              <button className="primary-button" type="submit">
                {editId ? t("updatePatient") : t("addPatient")}
              </button>

              {editId && (
                <button className="text-button" type="button" onClick={resetForm}>
                  {t("cancel")}
                </button>
              )}
            </div>
          </form>
        )}

        <section className="panel patient-list-panel">
          <div className="section-heading with-search">
            <div>
              <p className="eyebrow">{t("records")}</p>
              <h2>{t("allPatients")}</h2>
            </div>

            <input
              className="search-input"
              type="text"
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="patient-list">
            {filteredPatients.length === 0 ? (
              <p className="empty-state">{t("noPatients")}</p>
            ) : (
              filteredPatients.map((patient) => (
                <article className="patient-card" key={patient._id}>
                  <div className="patient-card-header">
                    <div>
                      <h3>{patient.name}</h3>
                      <p className="muted-text">
                        {t("age")}: {patient.age} - {t("gender")}: {patient.gender}
                      </p>
                    </div>

                    <span className={`risk-badge ${getRiskClassName(patient.riskLevel)}`}>
                      {patient.riskLevel}
                    </span>
                  </div>

                  <dl className="patient-details">
                    <div>
                      <dt>{t("symptomsLabel")}</dt>
                      <dd>{getSymptomsText(patient.symptoms)}</dd>
                    </div>
                    <div>
                      <dt>{t("diagnosis")}</dt>
                      <dd>{patient.diagnosis}</dd>
                    </div>
                  </dl>

                  {canManagePatient && (
                    <div className="card-actions">
                      <button className="secondary-button" type="button" onClick={() => editPatient(patient)}>
                        {t("editPatient")}
                      </button>
                      <button className="danger-button" type="button" onClick={() => deletePatient(patient._id)}>
                        {t("deletePatient")}
                      </button>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
