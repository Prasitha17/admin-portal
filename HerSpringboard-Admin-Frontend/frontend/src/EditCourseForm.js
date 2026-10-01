import { useState, useEffect } from 'react';
import './style.css';
export default function EditCourseForm({ course, onCourseUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    courseId: '',
    userId: '',
    category: '',
    completed: '',
    contents: '',
    cost: '',
    courseReview: '',
    description: '',
    enrolled: '',
    estimatedDuration: '',
    image: '',
    lastUpdatedOn: '',
    publishedOn: '',
    rating: '',
    requirements: '',
    title: '',
    whatWeCoverInCourse: '',
    whatYouLearn: '',
    createdBy: 'admin_ui', 
  });
  const [error, setError] = useState(null);
  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
        createdBy: 'admin_ui', 
      });
      setError(null);
    }
  }, [course]);
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
    try {
      const response = await fetch(
        `http://localhost:3002/courses/${encodeURIComponent(course.courseId)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedCourse = await response.json();
      console.log('Course updated on server:', updatedCourse);
      onCourseUpdated(); 
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error updating course');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      {error && <div style={{ color: 'red', marginBottom: '1em' }}>{error}</div>}
      
      <input
        name="courseId"
        placeholder="Course ID"
        value={formData.courseId}
        onChange={handleChange}
        required
      />
      <input
        name="userId"
        placeholder="User ID"
        value={formData.userId}
        onChange={handleChange}
      />
      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
      />
      <input
        name="completed"
        placeholder="Completed"
        value={formData.completed}
        onChange={handleChange}
      />
      <input
        name="contents"
        placeholder="Contents"
        value={formData.contents}
        onChange={handleChange}
      />
      <input
        name="cost"
        placeholder="Cost"
        value={formData.cost}
        onChange={handleChange}
        type="number"
        min="0"
      />
      <input
        name="courseReview"
        placeholder="Course Review"
        value={formData.courseReview}
        onChange={handleChange}
      />
      <input
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        name="enrolled"
        placeholder="Enrolled"
        value={formData.enrolled}
        onChange={handleChange}
        type="number"
        min="0"
      />
      <input
        name="estimatedDuration"
        placeholder="Estimated Duration"
        value={formData.estimatedDuration}
        onChange={handleChange}
      />
      <input
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
      />
      <input
        name="lastUpdatedOn"
        placeholder="Last Updated On (YYYY-MM-DD)"
        value={formData.lastUpdatedOn}
        onChange={handleChange}
        type="date"
      />
      <input
        name="publishedOn"
        placeholder="Published On (YYYY-MM-DD)"
        value={formData.publishedOn}
        onChange={handleChange}
        type="date"
      />
      <input
        name="rating"
        placeholder="Rating"
        value={formData.rating}
        onChange={handleChange}
        type="number"
        step="0.1"
        min="0"
        max="5"
      />
      <input
        name="requirements"
        placeholder="Requirements"
        value={formData.requirements}
        onChange={handleChange}
      />
      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        name="whatWeCoverInCourse"
        placeholder="What We Cover In Course"
        value={formData.whatWeCoverInCourse}
        onChange={handleChange}
      />
      <input
        name="whatYouLearn"
        placeholder="What You Learn"
        value={formData.whatYouLearn}
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
