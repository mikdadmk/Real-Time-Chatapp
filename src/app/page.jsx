"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "@fontsource/anek-malayalam";
import "@fontsource/poppins";

// Enhanced Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '#contact' },
    { name: 'Admission', href: '/register' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-green-800/90 backdrop-blur-md shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center space-x-3 group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative w-12 h-12 overflow-hidden rounded-xl shadow-lg">
              <Image 
                src="/images/Logo.png"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                alt="Islamic Dawa Academy Logo"
                priority
              />
            </div>
            <span className="text-xl font-bold text-white font-['Poppins'] tracking-wide">
              Islamic Dawa Academy
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-white rounded-lg font-['Poppins'] transition-all duration-300 
                  hover:bg-green-700/50 hover:text-green-200 hover:scale-105 
                  active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-green-700/50 transition-all duration-300
              active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ${
                isOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'
              }`} />
              <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 top-3 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ${
                isOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'
              }`} />
            </div>
          </button>
        </div>

        <div className={`md:hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 visible mt-4' : 'max-h-0 opacity-0 invisible mt-0'
        }`}>
          <div className="py-2 space-y-1 backdrop-blur-sm bg-green-800/50 rounded-xl px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-white rounded-lg font-['Poppins'] transition-all duration-300
                  hover:bg-green-700/50 hover:text-green-200 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main Home Component
export default function Home() {
  return (
    <div className="bg-gradient-to-b from-green-900 to-green-800 text-white min-h-screen">
      <Navbar />
      
      {/* Original Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center p-10 bg-[url('/images/pattern.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-green-900/70 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto text-center">
          <Image 
            src="/images/Asset3.png" 
            width={250}
            height={250}
            alt="Hero Image" 
            className="mb-8 hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-4xl sm:text-6xl font-bold font-malayalam mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
            ഹാഫിളീങ്ങൾക്കായി
          </h1>
          <p className="text-xl sm:text-2xl font-malayalam mb-8">സ്പെഷ്യൽ ഇന്റഗ്രേറ്റഡ് സിലബസ്</p>
          <Link
            href="https://wa.me/919656833399"
            className="group inline-flex items-center bg-green-500 hover:bg-green-400 text-white text-lg font-bold py-4 px-8 rounded-full shadow-xl transition-all hover:-translate-y-1"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="mr-2 text-xl group-hover:scale-110 transition-transform" /> 
            Enroll Now
          </Link>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-8 font-['Poppins'] text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
            About Islamic Dawa Academy
          </h2>
          <p className="text-lg sm:text-xl text-white-300 font-['Poppins'] leading-relaxed">
            Islamic Dawa Academy provides high-quality Quranic and Islamic education
            with an integrated syllabus tailored for Huffaz students.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-24">
        <h2 className="text-3xl sm:text-5xl font-bold mb-16 text-center font-['Poppins'] text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
          Our Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
              High-Quality Quranic Education
            </h3>
            <p className="text-white-300 font-['Poppins']">
              A special syllabus integrated with advanced memorization techniques and guidance for Huffaz students.
            </p>
          </div>
          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
              Experienced Teachers
            </h3>
            <p className="text-white-300 font-['Poppins']">
              Our teachers have years of experience in Quranic studies, making your learning journey smooth and effective.
            </p>
          </div>
          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
            Modern Learning Facilities
            </h3>
            <p className="text-white-300 font-['Poppins']">
            Dawa Academy Provide Modern Learning Facilities for the students for their bright future such as Smart Class Room, Digital Studio & IT LAB, etc.
            </p>
          </div>

          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
            Quranic Research Study
            </h3>
            <p className="text-white-300 font-['Poppins']">
            Advanced research in Quranic sciences and interpretation.
            </p>
          </div>

          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
            Special Doura Sessions
            </h3>
            <p className="text-white-300 font-['Poppins']">
            Exclusive lectures and interactive learning sessions.
            </p>
          </div>

          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
            Integrated Dual Degree & P.G
            </h3>
            <p className="text-white-300 font-['Poppins']">
            Earn dual academic and Islamic degrees together.
            </p>
          </div>

          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
            Multi-Linguistic Skills
            </h3>
            <p className="text-white-300 font-['Poppins']">
            Develop fluency in multiple languages including Arabic and English.
            </p>
          </div>

          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
            Eco-Friendly Campus
            </h3>
            <p className="text-white-300 font-['Poppins']">
            Green, sustainable environment for better learning.
            </p>
          </div>

          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
            Media Hub & I.T Lab
            </h3>
            <p className="text-white-300 font-['Poppins']">
            Technology-driven learning with modern media tools.
            </p>
          </div>

          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
            Digital Library
            </h3>
            <p className="text-white-300 font-['Poppins']">
            Access vast resources through an extensive digital library.
            </p>
          </div>

          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
            Skills Development
            </h3>
            <p className="text-white-300 font-['Poppins']">
            Practical training to enhance student capabilities.
            </p>
          </div>

          <div className="group p-8 bg-green-700/50 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-4 group-hover:text-green-300 transition-colors">
            Creative Development
            </h3>
            <p className="text-white-300 font-['Poppins']">
            Encouraging creativity and critical thinking.
            </p>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-6 py-24">
        <h2 className="text-3xl sm:text-5xl font-bold mb-16 text-center font-['Poppins'] text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="bg-green-700/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-3 rounded-full">
                <FontAwesomeIcon icon={faPhone} className="w-5 h-5" />
              </div>
              <p className="text-lg font-['Poppins']">+91 9656833399</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-3 rounded-full">
                <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
              </div>
              <p className="text-lg font-['Poppins']">info@dawaacademy.in</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-3 rounded-full">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5 h-5" />
              </div>
              <p className="text-lg font-['Poppins']">
                Virippadam-Akode, Vazhakkad via,<br/>
                Malappuram, Kerala - 673640
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-green-700/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold font-['Poppins'] mb-6">Send Us a Message</h3>
            <form action="#" method="POST" className="space-y-4">
              <input 
                type="text" 
                name="name" 
                placeholder="Your Name" 
                className="w-full py-3 px-6 rounded-lg bg-transparent border border-green-600/30 text-white placeholder-white-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" 
                required
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Your Email" 
                className="w-full py-3 px-6 rounded-lg bg-transparent border border-green-600/30 text-white placeholder-white-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" 
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                className="w-full py-3 px-6 rounded-lg bg-transparent border border-green-600/30 text-white placeholder-white-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              ></textarea>
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-full sm:col-span-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-center py-8">
        <p className="text-lg font-['Poppins'] text-white">
          © 2025 Islamic Dawa Academy | All rights reserved
        </p>
      </footer>
    </div>
  );
}
