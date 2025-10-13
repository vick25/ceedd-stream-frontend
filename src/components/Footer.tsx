import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 px-8 py-8 ">
        <div className="flex flex-col items-center text-gray-100  gap-4 lg:items-start  ">
          <Image
            src="/logo.jpg"
            alt="logo"
            width={40}
            height={40}
            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full"
          />
          <p className="max-w-sm text-sm leading-relaxed">
            CEEDD est une Organisation Non Gouvernementale de droit Congolais
            qui œuvre dans le secteur de la gestion durable des ressources
            environnementales pour le développement durable de la RDC
          </p>
        </div>
        <div className="flex flex-col items-center text-gray-100  gap-4 lg:items-start ">
          <h2 className="font-bold text-base py-3  lg:text-xl lg:py-4">
            Contactez-nous
          </h2>
          <span className="text-sm">Email:test@gmail.com</span>
          <span className="text-sm">+243 898243566</span>
        </div>
        <div className="flex flex-col items-center text-gray-100  gap-4 lg:items-start">
          <h2 className="font-bold text-base py-3  lg:text-xl lg:py-4">
            Navigation
          </h2>
          <ul className="flex flex-col items-center text-gray-100  gap-4 lg:items-start text-sm">
            <li>Donate</li>
            <li>Pourquoi l'eau</li>
            <li>Nos services</li>
            <li>A propos de nous</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="flex flex-col items-center text-gray-100  gap-4 lg:items-start">
          <h2 className="font-bold text-base py-3  lg:text-xl lg:py-4">
            Suivez-nous{" "}
          </h2>

          <div className="flex space-x-4">
            <a
              target="_blank"
              href="https://web.facebook.com/p/CEEDD-100075980903950"
              className="p-2 bg-white/10 rounded-full hover:bg-highlight hover:text-black transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              target="_blank"
              href="#"
              className="p-2 bg-white/10 rounded-full hover:bg-highlight hover:text-black transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              target="_blank"
              href="#"
              className="p-2 bg-white/10 rounded-full hover:bg-highlight hover:text-black transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
        <p>&copy;{new Date().getFullYear()} Ceedd. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
