import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeleteUserButton = ({ userId }) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    axios
      .delete(`http://localhost:5001/users/${userId}`)
      .then(() => {
        alert("User deleted successfully!");
        navigate("/users");
      })
      .catch(() => alert("Failed to delete user."));
  };

  return <button onClick={handleDelete} style={{ color: "red" }}>Delete User</button>;
};

export default DeleteUserButton;
