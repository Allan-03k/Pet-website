import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  useEffect(() => {
    axios
      .get(`http://localhost:5001/users/${id}`)
      .then((res) =>
        setFormData({ username: res.data.username, password: "" })
      )
      .catch(() => alert("User not found."));
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5001/users/${id}`, formData)
      .then(() => {
        alert("User updated successfully!");
        navigate(`/user/${id}`);
      })
      .catch(() => alert("Update failed."));
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>✏️ Edit User</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Username:
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Password:
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.submitButton}>Update</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  background: {
    backgroundImage: 'url("/images/background.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: "12px",
    padding: "30px",
    width: "400px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontSize: "1rem",
    display: "flex",
    flexDirection: "column",
    color: "#333",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "5px",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default EditUserPage;
