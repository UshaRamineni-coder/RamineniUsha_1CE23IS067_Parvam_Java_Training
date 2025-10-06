// Import React and hooks
import React, { useEffect, useState } from "react"; 
import api from "../api"; // Axios instance for making API requests
import { useNavigate, useParams } from "react-router-dom"; // Navigation helpers

// Default export for GameForm component
export default function GameForm() {
  // useParams() is used to read the `id` from the URL (/games/edit/:id)
  // If id exists → we are editing, else → adding new
  const { id } = useParams();

  // useNavigate() helps navigate programmatically
  const nav = useNavigate();

  // State to store form inputs
  const [form, setForm] = useState({
    gameName: "",       // Game name
    costPerHour: "",    // Cost per hour
    status: "ACTIVE"    // Default status
  });

  // State to show "Saving..." button text
  const [loading, setLoading] = useState(false);

  // useEffect runs when component mounts or when `id` changes
  // If id is present, load the game details into the form
  useEffect(() => { if (id) loadGame(id); }, [id]);

  // Fetch a game by ID from backend
  async function loadGame(id) {
    try {
      const res = await api.get(`/games/${id}`); // API call
      const g = res.data?.data; // Extract response data
      if (g) {
        // Fill form with existing game details
        setForm({
          gameName: g.gameName || "",
          costPerHour: g.costPerHour ?? "", // use ?? in case costPerHour is null
          status: g.status || "ACTIVE"
        });
      }
    } catch (err) {
      alert("Load game failed: " + (err.message || err));
    }
  }

  // Update form state when input values change
  function onChange(e) {
    const { name, value } = e.target; // Extract name & value of input
    setForm(prev => ({ ...prev, [name]: value })); // Update form dynamically
  }

  // Handle form submission
  async function onSubmit(e) {
    e.preventDefault(); // Prevent page reload
    setLoading(true);   // Show "Saving..." state
    try {
      // Prepare payload for API
      const payload = { ...form, costPerHour: form.costPerHour };
      if (id) {
        // If editing → update game
        await api.put(`/games/${id}`, payload);
        alert("Game updated");
      } else {
        // If adding new → create game
        await api.post("/games", payload);
        alert("Game created");
      }
      // Navigate back to games list after save
      nav("/games");
    } catch (err) {
      // Show error message
      alert("Save failed: " + (err.response?.data?.message || err.message || err));
    } finally {
      setLoading(false); // Reset loading state
    }
  }

  // JSX for rendering the form
  return (
    <div>
      {/* Heading changes based on Add/Edit mode */}
      <h2>{id ? "Edit Game" : "Add Game"}</h2>

      {/* Form with submit handler */}
      <form onSubmit={onSubmit}>
        
        {/* Game Name field */}
        <div style={{ marginBottom: 8 }}>
          <label>Game Name</label><br />
          <input 
            name="gameName" 
            value={form.gameName} 
            onChange={onChange} 
            required 
          />
        </div>

        {/* Cost per hour field */}
        <div style={{ marginBottom: 8 }}>
          <label>Cost per hour</label><br />
          <input 
            name="costPerHour" 
            value={form.costPerHour} 
            onChange={onChange} 
            type="number" 
            step="0.01" 
            required 
          />
        </div>

        {/* Status dropdown */}
        <div style={{ marginBottom: 8 }}>
          <label>Status</label><br />
          <select name="status" value={form.status} onChange={onChange}>
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </select>
        </div>

        {/* Submit and Cancel buttons */}
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        <button 
          type="button" 
          onClick={() => nav("/games")} 
          style={{ marginLeft: 8 }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
