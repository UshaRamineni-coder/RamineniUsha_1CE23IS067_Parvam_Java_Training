// Import React and necessary hooks
import React, { useEffect, useState } from "react";
// Import an API utility to make HTTP requests
import api from "../api";

// Define a functional React component
export default function TransactionList() {
  // useState hook to store transactions fetched from the API
  const [transactions, setTransactions] = useState([]);
  
  // useState hook to store member details fetched from the API
  const [members, setMembers] = useState([]);
  
  // useState hook to store game details fetched from the API
  const [games, setGames] = useState([]);
  
  // useState hook to indicate loading state (true while data is being fetched)
  const [loading, setLoading] = useState(true);

  // useEffect hook runs when the component mounts (empty dependency array)
  useEffect(() => { 
    fetchAll(); // Call fetchAll function to load data from the API
  }, []);

  // Async function to fetch transactions, members, and games from API
  async function fetchAll() {
    setLoading(true); // Set loading to true before starting the API call
    try {
      // Make multiple API calls in parallel using Promise.all
      const [tRes, mRes, gRes] = await Promise.all([
        api.get("/transactions"), // Get transactions data
        api.get("/members"),      // Get members data
        api.get("/games")         // Get games data
      ]);

      // Store the fetched data in the state
      setTransactions(tRes.data?.data || []); // Save transactions
      setMembers(mRes.data?.data || []);      // Save members
      setGames(gRes.data?.data || []);        // Save games
    } catch (err) {
      // Show alert if any API call fails
      alert("Error loading transactions: " + (err.message || err));
    } finally {
      setLoading(false); // Set loading to false after API calls complete
    }
  }

  // Create a map (object) from memberId to member name for easy lookup
  const memberMap = Object.fromEntries(
    (members || []).map(m => [m.memberId, m.name])
  );

  // Create a map (object) from gameId to gameName for easy lookup
  const gameMap = Object.fromEntries(
    (games || []).map(g => [g.gameId, g.gameName])
  );

  // Return the JSX (UI) for rendering
  return (
    <div>
      <h2>Transactions</h2>
      
      {/* Show loading text while fetching data */}
      {loading ? <p>Loading...</p> : (
        
        // Display transactions in a table
        <table 
          width="100%" 
          border="1" 
          cellPadding="6" 
          style={{ borderCollapse: "collapse" }}
        >
          {/* Table header */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Member</th>
              <th>Game</th>
              <th>Play Hrs</th>
              <th>Cost</th>
              <th>Date</th>
            </tr>
          </thead>
          
          {/* Table body */}
          <tbody>
            {/* If there are no transactions, show a message */}
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6">No transactions</td>
              </tr>
            ) : (
              // Map through each transaction and render a row
              transactions.map(tx => (
                <tr key={tx.transactionId}>
                  <td>{tx.transactionId}</td>  {/* Transaction ID */}
                  {/* Show member name, fallback to memberId if not found */}
                  <td>{memberMap[tx.memberId] ?? tx.memberId}</td>
                  {/* Show game name, fallback to gameId if not found */}
                  <td>{gameMap[tx.gameId] ?? tx.gameId}</td>
                  <td>{tx.playTimeHrs}</td>   {/* Hours played */}
                  <td>{tx.cost}</td>          {/* Cost of play */}
                  {/* Format transaction date or show "-" if missing */}
                  <td>{tx.transactionDate ? new Date(tx.transactionDate).toLocaleString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
 