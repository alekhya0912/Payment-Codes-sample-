// LandingPage.js
import React from "react";
import "./LandingPage.css";

export default function LandingPage({ profiles, onSelectProfile }) {
  return (
    <div className="landing-root">
      <h3>Select an Account to view your reports</h3>
      <div className="profile-row">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="profile-card"
            onClick={() => onSelectProfile(profile)}
            tabIndex={0}
            aria-label={`Select ${profile.name}`}
          >
            <div className="profile-name">{profile.name}</div>
            <div className="profile-accnum">{profile.accountNumber}</div>
            <div className="profile-bank">{profile.bankName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}  