import React, { useState } from "react";
import axios from "axios";

const SearchPage = () => {
  const [userId, setUserId] = useState("");
  const [petId, setPetId] = useState("");
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);

  const searchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/users/${userId}`);
      setUser(res.data);
    } catch (err) {
      alert("User not found.");
      setUser(null);
    }
  };

  const searchPet = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/pets/${petId}`);
      setPet(res.data);
    } catch (err) {
      alert("Pet not found.");
      setPet(null);
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔍 Search by ID</h2>

        <div style={styles.section}>
          <input
            type="number"
            placeholder="Enter user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={styles.input}
          />
          <button onClick={searchUser} style={styles.button}>Search User</button>

          {user && (
            <div style={styles.result}>
              <h4>User Found:</h4>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Username:</strong> {user.username}</p>
            </div>
          )}
        </div>

        <div style={styles.section}>
          <input
            type="number"
            placeholder="Enter pet ID"
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            style={styles.input}
          />
          <button onClick={searchPet} style={styles.button}>Search Pet</button>

          {pet && (
            <div style={styles.result}>
              <h4>Pet Found:</h4>
              <p><strong>ID:</strong> {pet.id}</p>
              <p><strong>Name:</strong> {pet.name}</p>
              <p><strong>Type:</strong> {pet.type}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Age:</strong> {pet.age}</p>
              <p><strong>Adopted:</strong> {pet.adopted ? "Yes" : "No"}</p>
            </div>
          )}
        </div>
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
    width: "450px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  section: {
    marginBottom: "30px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  result: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "12px",
    marginTop: "15px",
    boxShadow: "inset 0 0 4px rgba(0,0,0,0.05)",
  },
};

export default SearchPage;
