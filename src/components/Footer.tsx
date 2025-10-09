import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 h-96">
      <div className="flex flex-col  gap-4 p-8 lg:flex-row lg:justify-between">
        <div className="flex flex-col items-center text-gray-100  gap-4 lg:items-start ">
          <h2 className="font-bold text-base py-3  lg:text-xl lg:py-4">
            Contactez-nous
          </h2>
          <span>Email:test@gmail.com</span>
          <span>+243 898243566</span>
        </div>
        <div className="flex flex-col items-center text-gray-100  gap-4 lg:items-start">
          <h2 className="font-bold text-base py-3  lg:text-xl lg:py-4">
            Navigation
          </h2>
          <ul className="flex flex-col items-center text-gray-100  gap-4 lg:items-start">
            <li>Donate</li>
            <li>Pourquoi l'eau</li>
            <li>Nos services</li>
            <li>A propos de nous</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="flex flex-col items-center text-gray-100  gap-4 lg:items-start">
          <h2 className="font-bold text-base py-3  lg:text-xl lg:py-4">
            Contactez-nous
          </h2>
          <span>Email:test@gmail.com</span>
          <span>+243 898243566</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
