import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5001/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  const deleteUser = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    axios
      .delete(`http://localhost:5001/users/${userId}`)
      .then(() => {
        alert("User deleted.");
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      })
      .catch((err) => {
        console.error("Delete failed", err);
        alert("Delete failed.");
      });
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>👤 User Management</h2>
        {users.length === 0 ? (
          <p style={styles.empty}>No users found.</p>
        ) : (
          <ul style={styles.list}>
            {users.map((user) => (
              <li key={user.id} style={styles.listItem}>
                <span>
                  <strong>{user.username}</strong> (ID: {user.id})
                </span>
                <div style={styles.buttonGroup}>
                  <button onClick={() => navigate(`/users/${user.id}`)} style={styles.button}>View</button>
                  <button onClick={() => navigate(`/user/${user.id}/edit`)} style={styles.button}>Edit</button>
                  <button onClick={() => deleteUser(user.id)} style={styles.deleteButton}>Delete</button>
                </div>
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
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "60px 20px",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    maxWidth: "700px",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    color: "#777",
    fontSize: "1.1rem",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    marginBottom: "12px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "8px 14px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "8px 14px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
};

export default UserListPage;
