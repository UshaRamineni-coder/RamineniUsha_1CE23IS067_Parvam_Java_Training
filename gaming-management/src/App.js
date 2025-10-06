// Import React (needed to write JSX and components)
import React from "react";

// Import routing components from react-router-dom
// - Routes: Container for all defined routes
// - Route: Defines a single route (URL -> Component mapping)
// - Link: Used to navigate between pages without refreshing
import { Routes, Route, Link } from "react-router-dom";

// Import components for different pages/features
import MemberList from "./components/MemberList";
import MemberForm from "./components/MemberForm";
import GameList from "./components/GameList";
import GameForm from "./components/GameForm";
import RechargeForm from "./components/RechargeForm";
import TransactionList from "./components/TransactionList";
import DailyCollection from "./components/DailyCollection";

// Define a Navigation bar component
// This is a small reusable component that contains links to different pages
function Nav() {
  return (
    // Inline CSS for styling navigation bar
    <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      {/* Each Link navigates to a route without reloading the page */}
      <Link to="/" style={{ marginRight: 12 }}>Home</Link>
      <Link to="/members" style={{ marginRight: 12 }}>Members</Link>
      <Link to="/games" style={{ marginRight: 12 }}>Games</Link>
      <Link to="/recharge" style={{ marginRight: 12 }}>Recharge</Link>
      <Link to="/transactions" style={{ marginRight: 12 }}>Transactions</Link>
      <Link to="/daily-collections">Daily Collections</Link>
    </nav>
  );
}

// The main App component (entry point of our UI)
export default function App() {
  return (
    // Main container for the app with basic styling
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 1000, margin: "0 auto" }}>
      {/* Show navigation bar at the top */}
      <Nav />

      {/* Content section */}
      <div style={{ padding: 16 }}>
        {/* Routes define which component to show for which URL */}
        <Routes>
          {/* "/" → Home page (shows just a heading here) */}
          <Route path="/" element={<h2>Gaming Club Admin - Frontend</h2>} />

          {/* "/members" → Show list of members */}
          <Route path="/members" element={<MemberList />} />

          {/* "/members/add" → Form to add new member */}
          <Route path="/members/add" element={<MemberForm />} />

          {/* "/members/edit/:id" → Form to edit member (with dynamic id parameter) */}
          <Route path="/members/edit/:id" element={<MemberForm />} />

          {/* "/games" → Show list of games */}
          <Route path="/games" element={<GameList />} />

          {/* "/games/add" → Form to add new game */}
          <Route path="/games/add" element={<GameForm />} />

          {/* "/games/edit/:id" → Form to edit existing game (with dynamic id parameter) */}
          <Route path="/games/edit/:id" element={<GameForm />} />

          {/* "/recharge" → Recharge form */}
          <Route path="/recharge" element={<RechargeForm />} />

          {/* "/transactions" → List of all transactions */}
          <Route path="/transactions" element={<TransactionList />} />

          {/* "/daily-collections" → Daily collections page */}
          <Route path="/daily-collections" element={<DailyCollection />} />
        </Routes>
      </div>
    </div>
  );
}






