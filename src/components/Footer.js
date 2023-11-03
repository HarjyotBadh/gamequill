import React from "react";
import "../styles/Footer.css";
export default function Footer() {
  return (
    <div className="footer border-gray-200 bg-gray-600 p-8 text-white mt-20">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">GameQuill</h1>
          </div>
          <div className="space-x-6">
            <a href="#" className="text-gray-300 hover:text-white">
              About Us
            </a>
          </div>
        </div>
        <div className="mt-6"></div>
      </div>
    </div>
  );
}
