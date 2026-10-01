import { useState, useEffect } from "react";
export default function ManageCourses({ courses, onDelete, onEdit }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(courses);
  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(lowerSearch) ||
      course.category.toLowerCase().includes(lowerSearch)
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);
  return (
    <div className="manage-courses">
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search courses by title or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "6px", width: "250px" }}
        />
      </div>
      {filteredCourses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Published On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(course => (
              <tr key={course.courseId}>
                <td>{course.title}</td>
                <td>{course.category}</td>
                <td>{course.publishedOn}</td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button onClick={() => onEdit(course)}>Edit</button>
                    <button onClick={() => onDelete(course.courseId, course.userId)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
