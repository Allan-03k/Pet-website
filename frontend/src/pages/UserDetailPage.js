import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5001/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Failed to fetch user", err);
        alert("User not found.");
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:5001/users/${id}`)
        .then(() => {
          alert("User deleted successfully.");
          navigate("/users");
        })
        .catch((err) => {
          console.error("Failed to delete user", err);
          alert("Failed to delete user.");
        });
    }
  };

  if (!user) {
    return (
      <div style={styles.background}>
        <div style={{ color: "#fff", fontSize: "1.2rem" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>👤 User Details</h2>
        <p style={styles.item}><strong>ID:</strong> {user.id}</p>
        <p style={styles.item}><strong>Username:</strong> {user.username}</p>

        <div style={styles.buttonGroup}>
          <Link to={`/user/${user.id}/edit`}>
            <button style={styles.primaryButton}>Edit</button>
          </Link>
          <button onClick={handleDelete} style={styles.deleteButton}>Delete</button>
          <Link to="/users">
            <button style={styles.secondaryButton}>Back to User List</button>
          </Link>
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
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "400px",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  item: {
    fontSize: "1.1rem",
    marginBottom: "10px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "20px",
  },
  primaryButton: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: "pointer",
  },
};

export default UserDetailPage;
