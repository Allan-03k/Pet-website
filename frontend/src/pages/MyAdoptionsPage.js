import React, { useEffect, useState } from "react";
import axios from "axios";

const MyAdoptionsPage = () => {
  const [adoptions, setAdoptions] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const fetchAdoptions = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/adoptions/${userId}`);
      setAdoptions(response.data);
    } catch (error) {
      console.error("Failed to fetch adoptions:", error);
    }
  };

  const deleteAdoption = async (adoptionId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this adoption record?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5001/adoptions/${adoptionId}`);
      alert("Adoption record deleted.");
      fetchAdoptions();
    } catch (error) {
      console.error("Failed to delete adoption:", error);
      alert("Delete failed.");
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, [userId]);

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>My Adoptions</h2>
        {adoptions.length === 0 ? (
          <p style={styles.text}>No adoptions found.</p>
        ) : (
          <ul style={styles.list}>
            {adoptions.map((item) => (
              <li key={item.id} style={styles.listItem}>
                <span>
                  Pet Name: {item.pet_name} <br /> Adopted on: {item.adopted_on}
                </span>
                <button onClick={() => deleteAdoption(item.id)} style={styles.deleteButton}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
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
    width: '400px',
    maxHeight: '80vh',
    overflowY: 'auto',
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
  text: {
    fontSize: '1rem',
    color: '#555',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    width: '100%',
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1rem',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  }
};

export default MyAdoptionsPage;
