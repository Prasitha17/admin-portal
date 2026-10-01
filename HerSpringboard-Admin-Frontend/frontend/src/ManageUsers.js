import { useState, useEffect } from "react";
import axios from "axios";

export default function ManageUsers({ users, onDelete, onEdit, onBack }) {
  const [localUsers, setLocalUsers] = useState(users);
  const [showActionsFor, setShowActionsFor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

 const handleApproveReject = async (user, status) => {
  try {
   await axios.patch(
  `/users/${user.email.toLowerCase()}/approval`,
  {
    isApproved: status,
    category: user.category,
    registerType: user.registerType,
  }
);

    const updated = localUsers.map(currentUser =>
      currentUser.email === user.email
        ? {
            ...currentUser,
            isApproved: status,
          }
        : currentUser
    );

    setLocalUsers(updated);
    setShowActionsFor(null);

  } catch (err) {
    alert("❌ Failed to update approval status.");
    console.error(err);
  }
};

  const filteredUsers = localUsers.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const term = searchTerm.toLowerCase();

    return fullName.includes(term) || email.includes(term);
  });

  return (
    <div className="manage-users">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Category</th>
              <th>Email Verified</th>
              <th>Approval Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.email}>
                <td>
                  {user.firstName} {user.lastName}
                </td>

                <td>{user.email}</td>

                <td>{user.category}</td>

                <td>{user.emailVerified ? "Yes" : "No"}</td>

                <td>
                  {user.isApproved === "approved" && "✅ Approved"}

                  {user.isApproved === "rejected" && "❌ Rejected"}

                  {user.isApproved === "pending" &&
                    showActionsFor !== user.email && (
                      <button
                        onClick={() => setShowActionsFor(user.email)}
                      >
                        ⏳ Pending
                      </button>
                    )}

                  {user.isApproved === "pending" &&
                    showActionsFor === user.email && (
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "5px",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleApproveReject(user, "approved")
                          }
                        >
                          ✅ Approve
                        </button>

                        <button
                          onClick={() =>
                            handleApproveReject(user, "rejected")
                          }
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                </td>

                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <button onClick={() => onEdit(user)}>
                      Edit
                    </button>

                    <button onClick={() => onDelete(user.email)}>
                      Delete
                    </button>
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