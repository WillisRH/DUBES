"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

// Register the GSAP plugin
gsap.registerPlugin(ScrollTrigger);

export default function LiraVintageWebsite() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Refs for sections
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animation on scroll
  // GSAP animation for timeline items
  useEffect(() => {
    // Animate the hero section
    if (sectionsRef.current[0]) {
      gsap.fromTo(
        sectionsRef.current[0].querySelectorAll("h1, p"),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1, // Stagger the animations
          scrollTrigger: {
            trigger: sectionsRef.current[0],
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Animate the timeline items
    sectionsRef.current.forEach((section, index) => {
      if (index <= 1 && section) {
        gsap.fromTo(
          section.querySelectorAll(".timeline-item"),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.3, // Stagger the animations
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    // Animate additional content sections
    sectionsRef.current.forEach((section, index) => {
      if (index >= 2 && section) {
        gsap.fromTo(
          section.querySelectorAll("h1, p, h2, .bg-sepia-100"),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1, // Stagger the animations
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
              once: false
            },
          }
        );
      }
    });
  }, []);



  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-sepia-100 text-sepia-900 font-serif">
      {/* Navbar */}


      {/* Hero Section */}
      <section
        ref={(el: any) => (sectionsRef.current[0] = el)}
        className="h-screen flex flex-col justify-center items-center text-center px-4"
        id="home"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-wider">DUBES</h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed p-4">
        DUBES adalah sebuah sistem atau platform yang dirancang untuk memantau dan menganalisis kualitas tubuh, khususnya dalam hal kondisi fisik dan kualitas mental manusia. Dengan menggunakan media website, DUBES bertujuan untuk memberikan informasi yang akurat mengenai faktor-faktor yang mempengaruhi kesehatan individu secara keseluruhan.
        </p>
        <Link href="/body-score-test">
  <button className="mt-6 px-6 py-3 text-xl font-bold text-sepia-800 bg-sepia-200 border border-sepia-500 rounded-lg hover:bg-sepia-400 transition-all duration-300 ease-in-out vintage-button">
    Take Test →
  </button>
</Link>

      </section>

      {/* Additional Content */}
      <section
  ref={(el: any) => (sectionsRef.current[1] = el)}
  className="min-h-screen bg-sepia-200 py-16 px-4 relative"
  id="history"
>
  <div className="container mx-auto">
    <h2 className="text-4xl font-bold mb-8 text-center p-4">Discover the Legacy</h2>

    {/* Timeline Container */}
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-sepia-500 h-full z-0"></div>

      {/* Timeline Items */}
      <div className="grid md:grid-cols-1 gap-8 relative">
        <div className="timeline-item bg-sepia-100 p-6 rounded-lg shadow-md text-left relative">
          <h3 className="text-2xl font-bold mb-4">10 Oktober 2024</h3>
          <p className="text-lg">
            Tahap perencanaan projek, dimana kami disini memilih untuk membuat suatu website untuk melacak seluruh track record lingkungan di sekitar kita.
          </p>
          <span className="timeline-marker left-[-8px]"></span>
        </div>

        <div className="timeline-item bg-sepia-100 p-6 rounded-lg shadow-md text-right relative">
          <h3 className="text-2xl font-bold mb-4">20 November 2024</h3>
          <p className="text-lg">
            Penyetujuan Proposal yang diajukan kepada pihak BK dan Birokrat.
          </p>
          <span className="timeline-marker right-[-8px]"></span>
        </div>

        <div className="timeline-item bg-sepia-100 p-6 rounded-lg shadow-md text-left relative">
          <h3 className="text-2xl font-bold mb-4">21 November 2024</h3>
          <p className="text-lg">
            Tahap uji coba website DUBES di lingkup kelas 10, yang dibantuk pihak BK khususnya Bu Ely sebagai penanggung jawab BK kelas 10.
          </p>
          <span className="timeline-marker left-[-8px]"></span>
        </div>

        <div className="timeline-item bg-sepia-100 p-6 rounded-lg shadow-md text-right relative">
          <h3 className="text-2xl font-bold mb-4">11 Desember 2024</h3>
          <p className="text-lg">
            Laporan diajukan dan misi dari P5 kami telah selesai di laksanakan!
          </p>
          <span className="timeline-marker right-[-8px]"></span>
        </div>
      </div>
    </div>
  </div>
</section>




<section
  ref={(el: any) => (sectionsRef.current[4] = el)}
  className="h-screen flex flex-col justify-center items-center text-center px-4"
>
  <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-wider">Take the test now!</h1>
  <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed p-4">
    Kamu ingin mengetahui nilai tubuh mu?! langsung saja klik tombol di bawah ini!
  </p>
  <Link href="/body-score-test">
    <button className="mt-6 px-6 py-3 text-xl font-bold text-sepia-800 bg-sepia-200 border border-sepia-500 rounded-lg hover:bg-sepia-300 transition-all duration-300 ease-in-out vintage-button">
      Take Test →
    </button>
  </Link>
</section>


<footer className="bg-sepia-200 py-8 text-sepia-900">
      <div className="container mx-auto px-4">
        {/* Footer content visible only on medium and larger devices */}
        <div className="hidden md:flex flex-col md:flex-row justify-between items-center">
          {/* Logo and description */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-2">DUBES</h2>
            <p className="text-sepia-700">Website survey kesehatan SMAN 12 Jakarta</p>
          </div>

          {/* Quick Links */}
          <div className="mb-6 md:mb-0">
            <h4 className="text-xl font-bold mb-2">Quick Links</h4>
            <ul>
              <li>
                <Link href="/body-score-test" className="hover:text-sepia-600">
                  Body Score Test
                </Link>
              </li>
              <li>
                <Link href="/list-siswa" className="hover:text-sepia-600">
                  List Siswa
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-sepia-600">
                  Profile
                </Link>
              </li>
              {/* <li>
                <Link href="/events" className="hover:text-sepia-600">
                  Events
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-6 md:mb-0">
            <h4 className="text-xl font-bold mb-2">Contact</h4>
            <p>Email: contact@dubes.my.id</p>
          </div>

          {/* Social Media Links */}
          <div>
            <h4 className="text-xl font-bold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-sepia-600" target="_blank" rel="noopener noreferrer">
                Facebook
              </Link>
              <Link href="https://instagram.com" className="hover:text-sepia-600" target="_blank" rel="noopener noreferrer">
                Instagram
              </Link>
              <Link href="https://twitter.com" className="hover:text-sepia-600" target="_blank" rel="noopener noreferrer">
                Twitter
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright section always visible */}
        <div className="text-center mt-8 border-t border-sepia-300 pt-4">
          <p>&copy; {new Date().getFullYear()} Willis Rihatman. All rights reserved.</p>
        </div>
      </div>
    </footer>

    </div>
    </div>
  );
}
