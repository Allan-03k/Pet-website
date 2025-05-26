import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const PetDetailPage = () => {
  const { pet_id } = useParams();
  const [pet, setPet] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5001/pets/${pet_id}`)
      .then((res) => setPet(res.data))
      .catch((err) => {
        console.error("Failed to fetch pet details", err);
        alert("Pet not found.");
      });
  }, [pet_id]);

  const deletePet = () => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    axios
      .delete(`http://localhost:5001/pets/${pet_id}`)
      .then(() => {
        alert("Pet deleted successfully.");
        navigate("/");
      })
      .catch((err) => {
        console.error("Failed to delete pet", err);
        alert("Failed to delete pet.");
      });
  };

  if (!pet) {
    return (
      <div style={styles.background}>
        <div style={{ color: "#fff", fontSize: "1.2rem" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.background}>
      <Link to="/" style={styles.outsideBackButton}></Link>
      <div style={styles.container}>
        <div style={styles.topRight}>
          <Link to="/" style={styles.backButton}>← Back</Link>
        </div>

        <div style={styles.details}>
          <h2 style={styles.title}>🐾 Pet Details</h2>
          <p style={styles.item}><strong>ID:</strong> {pet.id}</p>
          <p style={styles.item}><strong>Name:</strong> {pet.name}</p>
          <p style={styles.item}><strong>Type:</strong> {pet.type}</p>
          <p style={styles.item}><strong>Breed:</strong> {pet.breed}</p>
          <p style={styles.item}><strong>Age:</strong> {pet.age}</p>
          <p style={styles.item}><strong>Adopted:</strong> {pet.adopted ? "Yes" : "No"}</p>

          <button onClick={deletePet} style={styles.deleteButton}>Delete</button>
        </div>

        <div style={styles.imageContainer}>
          <img
            src={pet.image_url || "/images/default_pet.png"}
            alt={pet.name}
            style={styles.image}
            onError={(e) => { e.target.src = "/images/default_pet.png"; }}
          />
        </div>
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
    padding: '40px',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'row',
    width: '900px',
    maxWidth: '95%',
    padding: '30px',
    position: 'relative',
  },
  topLeft: {
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
  backButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '5px 8px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  details: {
    flex: 1,
    paddingRight: '30px',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  item: {
    fontSize: '1.1rem',
    marginBottom: '8px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '20px',
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
};

export default PetDetailPage;
