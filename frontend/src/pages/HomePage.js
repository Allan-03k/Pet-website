import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [filter, setFilter] = useState("all");
  const [approved, setApproved] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch('http://localhost:5001/pets')
      .then((res) => res.json())
      .then((data) => {
        setPets(data.pets || []);
        setFilteredPets(data.pets || []);
      })
      .catch((err) => {
        console.error('Failed to fetch pets:', err);
        setPets([]);
        setFilteredPets([]);
      });
  }, []);

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:5001/user/${user.id}/questionnaire`)
        .then(res => {
          if (res.data.approved) {
            setApproved(true);
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  const applyFilter = (criteria) => {
    setFilter(criteria);
    let newList = [...pets];

    if (criteria === "cat") {
      newList = newList.filter(p => p.type.toLowerCase() === "cat");
    } else if (criteria === "dog") {
      newList = newList.filter(p => p.type.toLowerCase() === "dog");
    } else if (criteria === "youngest") {
      newList.sort((a, b) => a.age - b.age);
    }

    setFilteredPets(newList);
  };

  const markInterested = async (pet_id) => {
    try {
      await axios.patch(`http://localhost:5001/questionnaire/${user.id}`, { pet_id });
      alert("Marked as interested!");
    } catch (err) {
      alert("Failed to mark interest.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.header}>🐾 Adopt a Loving Friend</h1>
        <p style={styles.subtext}>
          Browse our adorable pets and give one a forever home!
        </p>

        <div style={styles.filterButtons}>
          {["all", "cat", "dog", "youngest"].map((type) => (
            <button
              key={type}
              onClick={() => applyFilter(type)}
              style={{
                padding: '10px 18px',
                backgroundColor: filter === type ? '#0056b3' : '#007BFF',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                transform: filter === type ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {type === "all" ? "All" :
               type === "cat" ? "Cats" :
               type === "dog" ? "Dogs" :
               "Youngest First"}
            </button>
          ))}
        </div>

        <div style={styles.cardContainer}>
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              style={styles.card}
              onClick={() => navigate(`/pets/${pet.id}`)}
            >
              {pet.image_url && (
                <img
                  src={pet.image_url}
                  alt={pet.name}
                  style={styles.image}
                  onError={(e) => {
                    e.target.src = "/images/default_pet.png";
                  }}
                />
              )}
              <h2>{pet.name}</h2>
              <p><strong>Type:</strong> {pet.type}</p>
              <p><strong>Breed:</strong> {pet.breed || "Unknown"}</p>
              <p><strong>Age:</strong> {pet.age}</p>
              {approved && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigation
                    markInterested(pet.id);
                  }}
                  style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                  I'm interested
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundImage: 'url("/images/background.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    fontFamily: 'Segoe UI, sans-serif',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '40px',
    borderRadius: '12px',
    maxWidth: '1100px',
    width: '100%',
  },
  header: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  subtext: {
    fontSize: '1.1rem',
    marginBottom: '20px',
    color: '#555',
    textAlign: 'center',
  },
  filterButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginBottom: '10px',
  }
};

export default HomePage;
