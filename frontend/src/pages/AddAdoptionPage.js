import React, { useState } from "react";
import axios from "axios";

const AddAdoptionPage = () => {
  const [userId, setUserId] = useState("");
  const [petId, setPetId] = useState("");
  const [message, setMessage] = useState("");

  const handleAddAdoption = () => {
    if (!userId || !petId) {
      setMessage("Please enter both user ID and pet ID.");
      return;
    }

    axios
      .post("http://localhost:5001/adoptions", {
        user_id: parseInt(userId),
        pet_id: parseInt(petId),
      })
      .then((res) => {
        setMessage("Adoption added successfully!");
        setUserId("");
        setPetId("");
      })
      .catch((err) => {
        console.error("Failed to add adoption", err);
        setMessage("Failed to add adoption.");
      });
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add Adoption Record</h2>
        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Pet ID"
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAddAdoption} style={styles.button}>
          Add Adoption
        </button>
        {message && <p style={{ marginTop: '10px', color: '#555' }}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  background: {
    backgroundImage: 'url("/images/background.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '10px',
  }
};

export default AddAdoptionPage;
