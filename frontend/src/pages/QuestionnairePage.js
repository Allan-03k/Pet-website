import React, { useState } from 'react';
import axios from 'axios';

const QuestionnairePage = () => {
  const [hasPets, setHasPets] = useState('');
  const [numChildren, setNumChildren] = useState('');
  const [hasYard, setHasYard] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be logged in to submit a questionnaire.");
      return;
    }

    const combinedAnswers = {
      has_pets: hasPets,
      num_children: numChildren,
      has_yard: hasYard,
      notes: notes
    };

    try {
      await axios.post('http://localhost:5001/questionnaire', {
        user_id: userId,
        answers: JSON.stringify(combinedAnswers)  // ✅ Now sending as 'answers'
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      alert("Submission failed.");
    }
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <h2 style={styles.header}>Thank you!</h2>
        <p style={styles.text}>Your questionnaire has been submitted.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Adoption Questionnaire</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Do you have any pets?</label>
        <select
          value={hasPets}
          onChange={(e) => setHasPets(e.target.value)}
          style={styles.input}
          required
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <label style={styles.label}>How many children are in your household?</label>
        <input
          type="number"
          value={numChildren}
          onChange={(e) => setNumChildren(e.target.value)}
          style={styles.input}
          min="0"
          required
        />

        <label style={styles.label}>Do you have a yard?</label>
        <select
          value={hasYard}
          onChange={(e) => setHasYard(e.target.value)}
          style={styles.input}
          required
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <label style={styles.label}>Anything else we should know?</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ ...styles.input, height: '80px' }}
        />

        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, sans-serif'
  },
  header: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  label: {
    fontSize: '1rem',
    color: '#555'
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  },
  button: {
    padding: '12px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  text: {
    fontSize: '1.1rem',
    color: '#555'
  }
};

export default QuestionnairePage;
