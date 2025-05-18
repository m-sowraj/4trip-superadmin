import React from "react";
import footerLogo from "../WhatsApp Image 2025-05-12 at 18.21.33_a096b1ed.jpg";

const Footer = () => (
  <footer className="bg-white text-black border-t border-gray-200 mt-32">
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Logo & Tagline */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <img
            src={footerLogo}
            alt="ORBITRA TECHNOLOGIES LLP"
            className="w-16 h-16 rounded-full shadow-lg object-cover border-2 border-indigo-500"
          />
          <div>
            <div className="text-2xl font-extrabold tracking-wide text-indigo-700">
              ORBITRA TECHNOLOGIES LLP
            </div>
            <div className="text-base text-gray-600 mt-1">
              Accelerating MVPs for Startups Everywhere
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-3">
          <a href="#" className="hover:text-indigo-600 transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
            </svg>
          </a>
          <a href="#" className="hover:text-indigo-600 transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344c-.98.98-1.213 2.092-1.272 3.373C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.613.059 1.281.292 2.393 1.272 3.373.981.981 2.093 1.213 3.374 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.292 3.374-1.272.98-.98 1.213-2.092 1.272-3.373.059-1.281.072-1.69.072-7.613 0-5.923-.013-6.332-.072-7.613-.059-1.281-.292-2.393-1.272-3.373-.981-.981-2.093-1.213-3.374-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
          </a>
          <a href="#" className="hover:text-indigo-600 transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.112C19.645 3.5 12 3.5 12 3.5s-7.645 0-9.386.574A2.994 2.994 0 0 0 .502 6.186C0 7.927 0 12 0 12s0 4.073.502 5.814a2.994 2.994 0 0 0 2.112 2.112C4.355 20.5 12 20.5 12 20.5s7.645 0 9.386-.574a2.994 2.994 0 0 0 2.112-2.112C24 16.073 24 12 24 12s0-4.073-.502-5.814zM9.545 15.568V8.432l6.545 3.568-6.545 3.568z" />
            </svg>
          </a>
        </div>
      </div>
      {/* Address */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="font-semibold text-indigo-700 mb-1">Address</div>
        <div className="text-gray-700 leading-relaxed">
          <span className="block">Building No./Flat No.: Shop no. 3</span>
          <span className="block">Name Of Premises/Building: Gokul Plaza</span>
          <span className="block">Road/Street: Veer Savarkar Road</span>
          <span className="block">
            Nearby Landmark: Nr RLY Phatak Gawad Wadi
          </span>
          <span className="block">Locality/Sub Locality: Virar East</span>
          <span className="block">City/Town/Village: Vasai Virar</span>
          <span className="block">District: Palghar</span>
          <span className="block">State: Maharashtra</span>
          <span className="block">PIN Code: 401303</span>
        </div>
      </div>
      {/* Quick Links & Contact */}
      <div className="flex flex-col gap-4">
        <div>
          <div className="font-semibold text-indigo-700 mb-1">Quick Links</div>
          <div className="flex flex-col gap-1 text-sm">
            <a href="#" className="hover:text-indigo-600 transition">
              Home
            </a>
            <a href="#" className="hover:text-indigo-600 transition">
              Our Works
            </a>
            <a href="#" className="hover:text-indigo-600 transition">
              Services
            </a>
            <a href="#" className="hover:text-indigo-600 transition">
              Testimonials
            </a>
            <a href="#" className="hover:text-indigo-600 transition">
              Blogs
            </a>
          </div>
        </div>
        <div>
          <div className="font-semibold text-indigo-700 mb-1">Contact</div>
          <div className="flex items-center gap-2 text-sm">
            <svg
              className="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 12H8m8 0a8 8 0 11-16 0 8 8 0 0116 0z" />
            </svg>
            <span>contact@anthillnetworks.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <svg
              className="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>+91 93630 88428</span>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-200 mt-8 py-4 text-xs flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4 gap-2 text-gray-500">
      <span className="hover:text-indigo-700 cursor-pointer">
        Terms of Service
      </span>
      <span>©Copyright 2024 ORBITRA TECHNOLOGIES LLP</span>
      <a
        href="/privacy-policy"
        className="hover:text-indigo-700 cursor-pointer transition"
      >
        Privacy Policy
      </a>
    </div>
  </footer>
);

export default Footer;
