import React, { useState } from 'react';
import axios from 'axios';

function AddPetPage() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: ''
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("type", formData.type);
    form.append("breed", formData.breed);
    form.append("age", formData.age);
    if (image) form.append("image", image);

    try {
      const response = await axios.post("http://localhost:5001/pets", form);
      if (response.status === 201) {
        setMessage("Pet added successfully!");
        setFormData({ name: "", type: "", breed: "", age: "" });
        setImage(null);
      } else {
        setMessage("Failed to add pet.");
      }
    } catch (error) {
      setMessage("Error occurred: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add a New Pet</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ width: '100%' }}>
          <label>Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
          </label>
          <label>Type:
            <input type="text" name="type" value={formData.type} onChange={handleChange} required style={styles.input} />
          </label>
          <label>Breed:
            <input type="text" name="breed" value={formData.breed} onChange={handleChange} style={styles.input} />
          </label>
          <label>Age:
            <input type="number" name="age" value={formData.age} onChange={handleChange} style={styles.input} />
          </label>
          <label>Image:
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={styles.input} />
          </label>
          <button type="submit" style={styles.button}>Add Pet</button>
        </form>
        {message && <p style={{ marginTop: '10px', color: '#555' }}>{message}</p>}
      </div>
    </div>
  );
}

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
    width: '350px',
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
    display: 'block',
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

export default AddPetPage;
