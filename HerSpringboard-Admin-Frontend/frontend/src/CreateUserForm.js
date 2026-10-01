import { useState, useEffect } from 'react';
import './style.css';
export default function CreateUserForm({ user, onUserCreated, onUserUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    email: '',
    category: '',
    courseCompleted: '',
    coursesInProgress: '',
    emailVerified: false,
    firstName: '',
    gender: '',
    goal: '',
    hoursSpentThisWeek: '',
    lastName: '',
    password: '',
    profileUrl: '',
    registerType: '',
    skills: '',
    userId: '',
  });
  const [error, setError] = useState(null);
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        emailVerified: user.emailVerified || false,
        userId: user.userId || '',
        password: '', 
      });
    } else {
      setFormData({
        email: '',
        category: '',
        courseCompleted: '',
        coursesInProgress: '',
        emailVerified: false,
        firstName: '',
        gender: '',
        goal: '',
        hoursSpentThisWeek: '',
        lastName: '',
        password: '',
        profileUrl: '',
        registerType: '',
        skills: '',
        userId: '',
      });
      setError(null);
    }
  }, [user]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const { userId, ...dataToSend } = formData;
    dataToSend.hoursSpentThisWeek = Number(dataToSend.hoursSpentThisWeek) || 0;
    try {
      const url = user
        ? `http://localhost:3002/users/${user.userId || user.email}`
        : 'http://localhost:3002/users';
      const method = user ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error('Failed to save user: ' + response.statusText);
      }
      if (user) {
        onUserUpdated();
      } else {
        onUserCreated();
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.message || 'Failed to save user');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
      <div className="form-group">
        <label htmlFor="firstName">First Name:</label>
        <input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name:</label>
        <input
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          type="email"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required={!user} 
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="courseCompleted">Course Completed:</label>
        <input
          name="courseCompleted"
          placeholder="Course Completed"
          value={formData.courseCompleted}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="coursesInProgress">Courses In Progress:</label>
        <input
          name="coursesInProgress"
          placeholder="Courses In Progress"
          value={formData.coursesInProgress}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="emailVerified">Email Verified:</label>
        <input
          type="checkbox"
          name="emailVerified"
          checked={formData.emailVerified}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="gender">Gender:</label>
        <input
          name="gender"
          placeholder="Gender"
          value={formData.gender}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="goal">Goal:</label>
        <input
          name="goal"
          placeholder="Goal"
          value={formData.goal}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="hoursSpentThisWeek">Hours Spent This Week:</label>
        <input
          name="hoursSpentThisWeek"
          placeholder="Hours Spent This Week"
          value={formData.hoursSpentThisWeek}
          onChange={handleChange}
          type="number"
          min="0"
        />
      </div>
      <div className="form-group">
        <label htmlFor="profileUrl">Profile URL:</label>
        <input
          name="profileUrl"
          placeholder="Profile URL"
          value={formData.profileUrl}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="registerType">Register Type:</label>
        <input
          name="registerType"
          placeholder="Register Type"
          value={formData.registerType}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="skills">Skills:</label>
        <input
          name="skills"
          placeholder="Skills"
          value={formData.skills}
          onChange={handleChange}
        />
      </div>
      <div className="button-group">
        <button type="submit">{user ? 'Save Changes' : 'Create User'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
