import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <div
      className="footer p-8 mt-20"
      style={{
        background: "var(--nav-bg)",
        borderTop: "1px solid var(--nav-border)",
        color: "var(--text-color)",
      }}
    >
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">GameQuill</h1>
          </div>
          <div className="space-x-6">
            <Link to="/about">About</Link>
            <Link to="/feedback">Feedback</Link>
          </div>
        </div>
        <div className="mt-6"></div>
      </div>
    </div>
  );
}
