// Import React and two React hooks: useState (for managing state) and useEffect (for lifecycle events)
import React, { useEffect, useState } from "react";

// Import our axios API instance (configured in api.js) to call backend APIs
import api from "../api";

// Import Link (for navigation via <a> like behavior) and useNavigate (programmatic navigation)
import { Link, useNavigate } from "react-router-dom";

// Export default component: MemberList (page to show all members)
export default function MemberList() {
  // State variable to hold members list (initially empty array)
  const [members, setMembers] = useState([]);

  // State variable to track loading status (true = loading, false = loaded)
  const [loading, setLoading] = useState(true);

  // Hook to navigate programmatically (e.g., go to edit page)
  const nav = useNavigate();

  // useEffect runs once when the component loads (because [] = dependency empty array)
  // Calls fetchMembers() to load data from backend
  useEffect(() => { fetchMembers(); }, []);

  // Function to fetch members from backend
  async function fetchMembers() {
    setLoading(true); // Start loading
    try {
      // Call backend API: GET /members
      const res = await api.get("/members");

      // Extract data from API response (res.data.data contains the list)
      setMembers(res.data?.data || []);
    } catch (err) {
      // Show error if request fails
      alert("Error fetching members: " + (err.message || err));
    } finally {
      // Stop loading whether success or failure
      setLoading(false);
    }
  }

  // Function to delete a member
  async function handleDelete(id) {
    // Ask user for confirmation before deleting
    if (!window.confirm("Delete this member?")) return;

    try {
      // Call backend DELETE /members/{id}
      await api.delete(`/members/${id}`);

      // Refresh member list after deletion
      fetchMembers();
    } catch (err) {
      // Show error if deletion fails
      alert("Delete failed: " + (err.message || err));
    }
  }

  // JSX (UI structure) returned by component
  return (
    <div>
      {/* Page heading */}
      <h2>Members</h2>

      {/* Add Member link (navigates to add form) */}
      <div style={{ marginBottom: 12 }}>
        <Link to="/members/add">+ Add Member</Link>
      </div>

      {/* Show loading message if still fetching */}
      {loading ? <p>Loading...</p> : (
        // Otherwise show table of members
        <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
              <th>Balance</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* If no members found, show one row message */}
            {members.length === 0 ? <tr><td colSpan="7">No members found</td></tr> :

              // Otherwise map over members and display each row
              members.map(m => (
                <tr key={m.memberId}>
                  <td>{m.memberId}</td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td>{m.balance ?? "-"}</td> {/* Show balance or "-" if null */}
                  <td>{m.status}</td>
                  <td>
                    {/* Button to navigate to edit page for this member */}
                    <button onClick={() => nav(`/members/edit/${m.memberId}`)}>Edit</button>

                    {/* Button to delete this member */}
                    <button onClick={() => handleDelete(m.memberId)} style={{ marginLeft: 8 }}>Delete</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      )}
    </div>
  );
}



