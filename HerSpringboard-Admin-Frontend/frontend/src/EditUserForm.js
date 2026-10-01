import { useState, useEffect } from 'react';
import './style.css';
export default function EditUserForm({ user, onUserUpdated, onCancel }) {
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
    createdBy: 'admin_ui', 
  });
  const [error, setError] = useState(null);
  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        emailVerified: user.emailVerified || false,
        createdBy: 'admin_ui', 
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
  console.log('🔁 handleSubmit triggered');
  setError(null);

  try {
    const response = await fetch(`http://localhost:3002/users/${encodeURIComponent(user.email)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedUser = await response.json();
    console.log('User updated on server:', updatedUser);

    onUserUpdated(); 
  } catch (err) {
    console.error(err);
    setError(err.message || 'Error updating user');
  }
};
  return (
    <form onSubmit={handleSubmit} className="form-container">
      {error && <div style={{ color: 'red', marginBottom: '1em' }}>{error}</div>}
      <input
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <input
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        type="email"
      />
      <input
        name="password"
        type="password"
        placeholder="Password (leave blank to keep unchanged)"
        value={formData.password}
        onChange={handleChange}
      />
      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />
      <input
        name="courseCompleted"
        placeholder="Course Completed"
        value={formData.courseCompleted}
        onChange={handleChange}
      />
      <input
        name="coursesInProgress"
        placeholder="Courses In Progress"
        value={formData.coursesInProgress}
        onChange={handleChange}
      />
      <label>
        Email Verified
        <input
          type="checkbox"
          name="emailVerified"
          checked={formData.emailVerified}
          onChange={handleChange}
        />
      </label>
      <input
        name="gender"
        placeholder="Gender"
        value={formData.gender}
        onChange={handleChange}
      />
      <input
        name="goal"
        placeholder="Goal"
        value={formData.goal}
        onChange={handleChange}
      />
      <input
        name="hoursSpentThisWeek"
        placeholder="Hours Spent This Week"
        type="number"
        min="0"
        value={formData.hoursSpentThisWeek}
        onChange={handleChange}
      />
      <input
        name="profileUrl"
        placeholder="Profile URL"
        value={formData.profileUrl}
        onChange={handleChange}
      />
      <input
        name="registerType"
        placeholder="Register Type"
        value={formData.registerType}
        onChange={handleChange}
      />
      <input
        name="skills"
        placeholder="Skills"
        value={formData.skills}
        onChange={handleChange}
      />
      <div className="button-group" style={{ marginTop: '1em' }}>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '1em' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
