// Import necessary React hooks and libraries
import React, { useEffect, useState } from "react"; // useState = manage component state, useEffect = run side-effects
import api from "../api"; // Axios instance for backend API calls
import { Link, useNavigate } from "react-router-dom"; // Link = navigation without page reload, useNavigate = programmatic navigation

// Default export of the GameList component
export default function GameList() {
  // State to store list of games
  const [games, setGames] = useState([]);
  // State to track loading spinner/message
  const [loading, setLoading] = useState(true);
  // Hook to navigate programmatically (redirect user to another page)
  const nav = useNavigate();

  // useEffect hook runs when the component is first rendered (empty dependency = run once)
  useEffect(() => { fetchGames(); }, []);

  // Fetch games from backend API
  async function fetchGames() {
    setLoading(true); // show loading state
    try {
      // Send GET request to backend API `/games`
      const res = await api.get("/games");
      // Store fetched games in state (fallback to [] if no data)
      setGames(res.data?.data || []);
    } catch (err) {
      // Handle error by showing alert
      alert("Error fetching games: " + (err.message || err));
    } finally {
      // Turn off loading state once done (success or failure)
      setLoading(false);
    }
  }

  // Function to delete a game by its ID
  async function handleDelete(id) {
    // Ask for confirmation before deleting
    if (!window.confirm("Delete this game?")) return;
    try {
      // Send DELETE request to backend API
      await api.delete(`/games/${id}`);
      // Refresh list of games after successful deletion
      fetchGames();
    } catch (err) {
      // Show error if deletion fails
      alert("Delete failed: " + (err.message || err));
    }
  }

  // JSX (UI rendering)
  return (
    <div>
      <h2>Games</h2>
      {/* Link to add a new game */}
      <div style={{ marginBottom: 12 }}>
        <Link to="/games/add">+ Add Game</Link>
      </div>

      {/* Conditional rendering: if loading, show "Loading...", else show table */}
      {loading ? <p>Loading...</p> : (
        <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {/* Table headers */}
              <th>ID</th><th>Name</th><th>Cost/Hour</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* If no games are found, show message inside table */}
            {games.length === 0 ? <tr><td colSpan="5">No games</td></tr> :
              // Loop over games and render each as a row
              games.map(g => (
                <tr key={g.gameId}>
                  <td>{g.gameId}</td>
                  <td>{g.gameName}</td>
                  <td>{g.costPerHour}</td>
                  <td>{g.status}</td>
                  <td>
                    {/* Navigate to Edit page with gameId */}
                    <button onClick={() => nav(`/games/edit/${g.gameId}`)}>Edit</button>
                    {/* Delete game when clicked */}
                    <button onClick={() => handleDelete(g.gameId)} style={{ marginLeft: 8 }}>Delete</button>
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

