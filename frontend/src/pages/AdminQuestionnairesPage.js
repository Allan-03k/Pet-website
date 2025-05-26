import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminQuestionnairesPage = () => {
  const [questionnaires, setQuestionnaires] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/questionnaire/all")
      .then((res) => setQuestionnaires(res.data))
      .catch((err) => console.error("Failed to fetch:", err));
  }, []);

  const approve = async (userId) => {
    try {
      await axios.patch(`http://localhost:5001/questionnaire/approve/${userId}`);
      const updated = questionnaires.map(q =>
        q.user_id === userId ? { ...q, approved: true } : q
      );
      setQuestionnaires(updated);
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admin Questionnaire Review</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Answers</th>
            <th>Approved</th>
            <th>Interested Pet ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questionnaires.map((q) => {
            let parsedAnswers = {};
            try {
              parsedAnswers = JSON.parse(q.answers);
            } catch (e) {
              parsedAnswers = { error: "Invalid JSON" };
            }

            return (
              <tr key={q.id}>
                <td>{q.username}</td>
                <td>
                  <div style={styles.answerBox}>
                    <div><strong>Has Pets:</strong> {parsedAnswers.has_pets}</div>
                    <div><strong>Children:</strong> {parsedAnswers.num_children}</div>
                    <div><strong>Yard:</strong> {parsedAnswers.has_yard}</div>
                    <div><strong>Notes:</strong> {parsedAnswers.notes}</div>
                  </div>
                </td>
                <td>{q.approved ? "✅" : "❌"}</td>
                <td>{q.interested_pet_id ?? "—"}</td>
                <td>
                  {!q.approved && (
                    <button style={styles.button} onClick={() => approve(q.user_id)}>
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif"
  },
  header: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#333"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  },
  answerBox: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "0.95rem"
  },
  button: {
    padding: "6px 12px",
    fontSize: "0.9rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  th: {
    borderBottom: "1px solid #ddd",
    padding: "10px"
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #eee"
  }
};

export default AdminQuestionnairesPage;
