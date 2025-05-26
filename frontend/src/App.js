import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDetailPage from './pages/UserDetailPage';
import AddPetPage from './pages/AddPetPage';
import HomePage from './pages/HomePage';
import MyAdoptionsPage from './pages/MyAdoptionsPage';
import EditUserPage from './pages/EditUserPage';
import UserListPage from './pages/UserListPage';
import PetDetailPage from './pages/PetDetailPage';
import SearchPage from './pages/SearchPage';
import AddAdoptionPage from './pages/AddAdoptionPage';
import AdminQuestionnairesPage from './pages/AdminQuestionnairesPage';
import QuestionnairePage from './pages/QuestionnairePage'; // NEW

function App() {
  const [hovered, setHovered] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Invalid user data in localStorage.");
    }
  }, []);

  const isAdmin = user?.role === 1;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' },
    ...(user && !isAdmin ? [{ path: '/questionnaire', label: 'Questionnaire' }] : []),
    ...(isAdmin ? [
      { path: '/add-pet', label: 'Add Pet' },
      { path: '/users', label: 'User List' },
      { path: '/add-adoption', label: 'Add Adoption' },
      { path: '/admin-questionnaires', label: 'Questionnaires' }
    ] : []),
    { path: '/my-adoptions', label: 'My Adoptions' },
    { path: '/search', label: 'Search' },
  ];

  return (
    <Router>
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          {navItems.map((item, idx) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                backgroundColor: hovered === idx ? '#495057' : 'transparent'
              }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {user && (
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            style={{
              ...styles.link,
              marginLeft: 'auto',
              marginRight: '20px',
              backgroundColor: '#dc3545',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/add-pet" element={<AddPetPage />} />
        <Route path="/pets/:pet_id" element={<PetDetailPage />} />
        <Route path="/my-adoptions" element={<MyAdoptionsPage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route path="/user/:id/edit" element={<EditUserPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/add-adoption" element={<AddAdoptionPage />} />
        <Route path="/admin-questionnaires" element={<AdminQuestionnairesPage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/delete-adoption/:adoptionId" element={<MyAdoptionsPage />} />
      </Routes>
    </Router>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#343a40',
    padding: '14px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navContent: {
    display: 'flex',
    gap: '18px',
    alignItems: 'center',
    marginLeft: '20px'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    padding: '6px 14px',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
  }
};

export default App;