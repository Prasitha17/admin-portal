import { useEffect, useState } from 'react';
import ManageUsers from './ManageUsers';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';
import ManageCourses from './ManageCourses';
import CreateCourseForm from './CreateCourseForm';
import EditCourseForm from './EditCourseForm';
export default function App({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [userError, setUserError] = useState(null);
  const [courseError, setCourseError] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);
  const [mainView, setMainView] = useState('main');
  const [manageView, setManageView] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const response = await fetch('http://localhost:3002/users');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUsers(data);
      setUserError(null);
    } catch (err) {
      setUserError(err.message);
      setUsers([]);
    } finally {
      setIsUsersLoading(false);
    }
  };
  const fetchCourses = async () => {
    setIsCoursesLoading(true);
    try {
      const response = await fetch('http://localhost:3002/courses');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCourses(data);
      setCourseError(null);
    } catch (err) {
      setCourseError(err.message);
      setCourses([]);
    } finally {
      setIsCoursesLoading(false);
    }
  };
  useEffect(() => {
    if (mainView === 'manageUsers' && manageView === 'list') fetchUsers();
    if (mainView === 'manageCourses' && manageView === 'list') fetchCourses();
  }, [mainView, manageView]);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setManageView('edit');
  };
  const handleDeleteUser = async (email) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`http://localhost:3002/users/${email}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      await fetchUsers();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setManageView('edit');
  };
  const handleDeleteCourse = async (courseId, userId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`http://localhost:3002/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to delete course');
      await fetchCourses();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };
  const handleCancel = () => {
    setEditingUser(null);
    setEditingCourse(null);
    setManageView('list');
  }
  const styles = {
    container: {
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#f5f6fa',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    header: {
      backgroundColor: '#0d3f8f',
      color: '#fff',
      padding: '20px 30px',
      fontSize: '24px',
      fontWeight: '600',
      width: '100%',
      textAlign: 'center',
    },
    topButtons: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
      padding: '20px 30px',
      flexWrap: 'wrap',
    },
    button: {
      padding: '16px 24px',
      fontSize: '18px',
      backgroundColor: '#0d3f8f',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      minWidth: '180px',
      fontWeight: 'bold',
      transition: '0.2s ease',
    },
    content: {
      padding: '0 30px 30px',
      width: '100%',
      maxWidth: '1000px',
    },
  };
  return (
    <div style={styles.container}>
      <div style={styles.header}>Admin Dashboard</div>

      {mainView === 'main' && (
     <div style={styles.topButtons}>
    <button style={styles.button} onClick={() => { setMainView('manageUsers'); setManageView(''); }}>
      Manage Users
    </button>
    <button style={styles.button} onClick={() => { setMainView('manageCourses'); setManageView(''); }}>
      Manage Courses
    </button>
    <button style={styles.button} onClick={onLogout}>
      Logout
    </button>
  </div>
)}
      {(mainView === 'manageUsers' || mainView === 'manageCourses') && (
        <>
          {manageView === '' && (
            <div style={styles.topButtons}>
              <button style={styles.button} onClick={() => {
                setManageView('create');
                mainView === 'manageUsers' ? setEditingUser(null) : setEditingCourse(null);
              }}>
                {mainView === 'manageUsers' ? 'Create User' : 'Create Course'}
              </button>

              <button style={styles.button} onClick={() => {
                setManageView('list');
                mainView === 'manageUsers' ? fetchUsers() : fetchCourses();
              }}>
                {mainView === 'manageUsers' ? 'User List' : 'Course List'}
              </button>
              <button style={styles.button} onClick={() => {
                setMainView('main');
                setManageView('');
              }}>
                Back
              </button>
            </div>
          )}
          {manageView !== '' && (
            <div style={styles.topButtons}>
              <button style={styles.button} onClick={() => {
                if (manageView === 'edit') {
                  setManageView('list');
                } else if (manageView === 'list' || manageView === 'create') {
                  setManageView('');
                } else {
                  setMainView('main');
                }
                setEditingUser(null);
                setEditingCourse(null);
              }}>
                Back
              </button>
            </div>
          )}
          <div style={styles.content}>
            {mainView === 'manageUsers' ? (
              isUsersLoading ? (
                <p>Loading...</p>
              ) : userError ? (
                <p>Error: {userError}</p>
              ) : manageView === 'list' ? (
                <ManageUsers users={users} onDelete={handleDeleteUser} onEdit={handleEditUser} fetchUsers={fetchUsers} />
              ) : manageView === 'create' ? (
                <CreateUserForm onUserCreated={() => { fetchUsers(); handleCancel(); }} onCancel={handleCancel} />
              ) : manageView === 'edit' && editingUser ? (
                <EditUserForm user={editingUser} onUserUpdated={() => { fetchUsers(); handleCancel(); }} onCancel={handleCancel} />
              ) : null
            ) : (
              isCoursesLoading ? (
                <p>Loading...</p>
              ) : courseError ? (
                <p>Error: {courseError}</p>
              ) : manageView === 'list' ? (
                <ManageCourses courses={courses} onDelete={handleDeleteCourse} onEdit={handleEditCourse} fetchCourses={fetchCourses} />
              ) : manageView === 'create' ? (
                <CreateCourseForm onCourseCreated={() => { fetchCourses(); handleCancel(); }} onCancel={handleCancel} />
              ) : manageView === 'edit' && editingCourse ? (
                <EditCourseForm course={editingCourse} onCourseUpdated={() => { fetchCourses(); handleCancel(); }} onCancel={handleCancel} />
              ) : null
            )}
          </div>
        </>
      )}
    </div>
  );
}
