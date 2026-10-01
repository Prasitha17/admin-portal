import { useState, useEffect } from 'react';
import './style.css';
export default function CreateCourseForm({ course, onCourseCreated, onCourseUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    courseID: '',
    userId: '',
    category: '',
    completed: false,
    contents: '',
    cost: '',
    courseReview: '',
    description: '',
    enrolled: 0,
    estimatedDuration: '',
    image: '',
    lastUpdatedOn: '',
    publishedOn: '',
    rating: 0,
    requirements: '',
    title: '',
    whatWeCoverInCourse: '',
    whatYouLearn: '',
  });
  const [error, setError] = useState(null);
  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
        completed: course.completed || false,
        enrolled: course.enrolled || 0,
        rating: course.rating || 0,
      });
    } else {
      setFormData({
        courseID: '',
        userId: '',
        category: '',
        completed: false,
        contents: '',
        cost: '',
        courseReview: '',
        description: '',
        enrolled: 0,
        estimatedDuration: '',
        image: '',
        lastUpdatedOn: '',
        publishedOn: '',
        rating: 0,
        requirements: '',
        title: '',
        whatWeCoverInCourse: '',
        whatYouLearn: '',
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
      const dataToSend = {
        ...formData,
        enrolled: Number(formData.enrolled) || 0,
        rating: Number(formData.rating) || 0,
      };
      const url = course
        ? `http://localhost:3002/courses/${course.courseID || course.userId}`
        : 'http://localhost:3002/courses';
      const method = course ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        throw new Error('Failed to save course: ' + response.statusText);
      }
      if (course) {
        onCourseUpdated();
      } else {
        onCourseCreated();
      }
    } catch (err) {
      console.error('Error saving course:', err);
      setError(err.message || 'Failed to save course');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

      <div className="form-group">
        <label htmlFor="courseID">Course ID:</label>
        <input
          name="courseID"
          placeholder="Course ID"
          value={formData.courseID}
          onChange={handleChange}
          required={!course}
          disabled={!!course}
        />
      </div>
      <div className="form-group">
        <label htmlFor="userId">User ID (Creator):</label>
        <input
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
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
        <label htmlFor="completed">Completed:</label>
        <input
          type="checkbox"
          name="completed"
          checked={formData.completed}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="contents">Contents:</label>
        <textarea
          name="contents"
          placeholder="Contents"
          value={formData.contents}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="cost">Cost:</label>
        <input
          name="cost"
          placeholder="Cost"
          value={formData.cost}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="courseReview">Course Review:</label>
        <textarea
          name="courseReview"
          placeholder="Course Review"
          value={formData.courseReview}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="enrolled">Enrolled:</label>
        <input
          name="enrolled"
          type="number"
          min="0"
          placeholder="Enrolled"
          value={formData.enrolled}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="estimatedDuration">Estimated Duration:</label>
        <input
          name="estimatedDuration"
          placeholder="Estimated Duration"
          value={formData.estimatedDuration}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="image">Image URL:</label>
        <input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastUpdatedOn">Last Updated On:</label>
        <input
          name="lastUpdatedOn"
          placeholder="Last Updated On"
          value={formData.lastUpdatedOn}
          onChange={handleChange}
          type="date"
        />
      </div>
      <div className="form-group">
        <label htmlFor="publishedOn">Published On:</label>
        <input
          name="publishedOn"
          placeholder="Published On"
          value={formData.publishedOn}
          onChange={handleChange}
          type="date"
        />
      </div>
      <div className="form-group">
        <label htmlFor="rating">Rating:</label>
        <input
          name="rating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="requirements">Requirements:</label>
        <textarea
          name="requirements"
          placeholder="Requirements"
          value={formData.requirements}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="whatWeCoverInCourse">What We Cover In Course:</label>
        <textarea
          name="whatWeCoverInCourse"
          placeholder="What We Cover In Course"
          value={formData.whatWeCoverInCourse}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="whatYouLearn">What You Learn:</label>
        <textarea
          name="whatYouLearn"
          placeholder="What You Learn"
          value={formData.whatYouLearn}
          onChange={handleChange}
        />
      </div>
      <div className="button-group">
        <button type="submit">{course ? 'Save Changes' : 'Create Course'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
