// Import required libraries
import React, { useEffect, useState } from "react"; 
import api from "../api"; // axios instance to interact with backend APIs

// Default export for the RechargeForm component
export default function RechargeForm() {

  // State to hold all members fetched from the backend
  const [members, setMembers] = useState([]);

  // State to hold recharge history (previous recharges)
  const [history, setHistory] = useState([]);

  // State to hold form inputs (selected memberId and recharge amount)
  const [form, setForm] = useState({ memberId: "", amount: "" });

  // State to show "Processing..." while submitting recharge
  const [loading, setLoading] = useState(false);

  // useEffect → runs once when component is mounted
  // Fetch members and recharge history initially
  useEffect(() => {
    fetchMembers();  // load member list for dropdown
    fetchHistory();  // load recharge history for table
  }, []);

  // Fetch all members from API
  async function fetchMembers() {
    try {
      const res = await api.get("/members"); // GET request to backend
      setMembers(res.data?.data || []); // store members in state (fallback empty array)
    } catch (err) {
      console.error(err); // log errors in console
    }
  }

  // Fetch recharge history from API
  async function fetchHistory() {
    try {
      const res = await api.get("/recharges"); // GET request to backend
      setHistory(res.data?.data || []); // update history state
    } catch (err) {
      console.error(err); // log error in case of failure
    }
  }

  // Generic input change handler for form fields
  function onChange(e) {
    const { name, value } = e.target; // extract name & value from input
    // Update only the changed field while keeping others intact
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Handle recharge form submission
  async function onSubmit(e) {
    e.preventDefault();   // prevent page reload
    setLoading(true);     // disable button & show "Processing..."
    try {
      // API request to recharge wallet
      await api.post("/recharges", {
        memberId: Number(form.memberId), // convert string to number
        amount: Number(form.amount)      // convert string to number
      });
      alert("Recharged successfully"); // success message

      // Reset form after recharge
      setForm({ memberId: "", amount: "" });

      // Refresh recharge history to include the new recharge
      fetchHistory();
    } catch (err) {
      // Show error message if recharge fails
      alert("Recharge failed: " + (err.response?.data?.message || err.message || err));
    } finally {
      // Re-enable button after API request completes
      setLoading(false);
    }
  }

  // JSX for UI rendering
  return (
    <div>
      <h2>Recharge Wallet</h2>

      {/* Recharge form */}
      <form onSubmit={onSubmit}>
        {/* Member dropdown */}
        <div style={{ marginBottom: 8 }}>
          <label>Member</label><br />
          <select 
            name="memberId" 
            value={form.memberId} 
            onChange={onChange} 
            required
          >
            <option value="">Select member</option>
            {/* Populate dropdown with members */}
            {members.map(m => (
              <option key={m.memberId} value={m.memberId}>
                {m.name} (ID:{m.memberId})
              </option>
            ))}
          </select>
        </div>

        {/* Amount input field */}
        <div style={{ marginBottom: 8 }}>
          <label>Amount</label><br />
          <input 
            name="amount" 
            value={form.amount} 
            onChange={onChange} 
            type="number" 
            step="0.01" 
            required 
          />
        </div>

        {/* Submit button */}
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Recharge"}
        </button>
      </form>

      {/* Recharge history section */}
      <h3 style={{ marginTop: 20 }}>Recharge History</h3>
      <table 
        width="100%" 
        border="1" 
        cellPadding="6" 
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Member ID</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* If no recharges, show message */}
          {history.length === 0 ? (
            <tr><td colSpan="4">No recharges yet</td></tr>
          ) : (
            // Show recharge history
            history.map(r => (
              <tr key={r.rechargeId}>
                <td>{r.rechargeId}</td>
                <td>{r.memberId}</td>
                <td>{r.amount}</td>
                {/* Format date into readable format */}
                <td>{new Date(r.rechargeDate).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}



