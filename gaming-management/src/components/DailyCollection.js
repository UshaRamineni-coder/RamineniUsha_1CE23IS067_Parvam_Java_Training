// Import React and hooks for state and lifecycle management
import React, { useEffect, useState } from "react";
// Import the API utility to make HTTP requests
import api from "../api";

// Functional component to display daily collections
export default function DailyCollection() {
  // State to store all daily collections fetched from the API
  const [collections, setCollections] = useState([]);
  
  // State to store the date selected by the user for filtering
  const [date, setDate] = useState("");
  
  // State to store collection data for a selected date
  const [selected, setSelected] = useState(null);

  // useEffect runs once when the component mounts
  useEffect(() => { 
    fetchCollections(); // Fetch all daily collections initially
  }, []);

  // Function to fetch all daily collections from API
  async function fetchCollections() {
    try {
      const res = await api.get("/daily-collections"); // GET request to fetch collections
      setCollections(res.data?.data || []); // Save data to state or empty array if null
    } catch (err) {
      console.error(err); // Log error in console
      alert("Failed to fetch daily collections"); // Show alert on error
    }
  }

  // Function to fetch collection for a specific date
  async function fetchByDate() {
    if (!date) return; // If no date selected, do nothing
    try {
      const res = await api.get(`/daily-collections/${date}`); // GET request for the specific date
      setSelected(res.data?.data || null); // Set selected collection or null
    } catch (err) {
      alert("No data for date or error: " + (err.message || err)); // Alert if error occurs
      setSelected(null); // Reset selected if error
    }
  }

  // JSX for rendering the component
  return (
    <div>
      <h2>Daily Collections</h2>
      
      {/* Input for selecting date and a button to fetch collection for that date */}
      <div style={{ marginBottom: 12 }}>
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)} // Update state when date changes
        />
        <button 
          onClick={fetchByDate} 
          style={{ marginLeft: 8 }}
        >
          Get by Date
        </button>
      </div>

      {/* Display selected collection details if a date is selected */}
      {selected ? (
        <div style={{ marginBottom: 12 }}>
          <h3>Collection for {selected.collectionDate}</h3>
          <p>Total recharges: {selected.totalRecharges}</p>
          <p>Total spent: {selected.totalSpent}</p>
          <p>Net collection: {selected.netCollection}</p>
        </div>
      ) : null}

      {/* Display all daily collections in a table */}
      <h3>All Daily Collections</h3>
      <table 
        width="100%" 
        border="1" 
        cellPadding="6" 
        style={{ borderCollapse: "collapse" }}
      >
        {/* Table headers */}
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Recharges</th>
            <th>Total Spent</th>
            <th>Net</th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {/* Show a message if no collections exist */}
          {collections.length === 0 ? (
            <tr><td colSpan="4">No records</td></tr>
          ) : (
            // Map each collection and create a table row
            collections.map(c => (
              <tr key={c.collectionId}>
                <td>{c.collectionDate}</td>       {/* Date of collection */}
                <td>{c.totalRecharges}</td>      {/* Total recharges */}
                <td>{c.totalSpent}</td>          {/* Total spent */}
                <td>{c.netCollection}</td>       {/* Net collection */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

