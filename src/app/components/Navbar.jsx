"use client";
import React, { useState, useEffect } from "react";
import SignInModal from "./SignInModal";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.location.reload();
    setLoggedIn(false);
  };

  const openSignInModal = () => {
    setSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setSignInModalOpen(false);
  };

  // Fungsi untuk mengirim data ke API
  const fetchDataToApi = async (userData) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Jika login berhasil
        const { token } = await response.json();

        window.localStorage.setItem("token", token);

        // Lakukan refresh halaman setelah login berhasil
        window.location.reload();

        setLoggedIn(true);
        if (!token) {
          setLoggedIn(false);
          response.json({ massage: "login Failed" });
        }

        // Tutup modal login (jika perlu)
        closeSignInModal();
      } else {
        console.error("Login gagal");
      }
    } catch (error) {
      console.error("Error selama login:", error);
    }
  };

  useEffect(() => {
    // Pemeriksaan status login pada saat komponen dimuat
    const checkLoggedInStatus = () => {
      const storedToken = window.localStorage.getItem("token");
      if (storedToken) {
        setLoggedIn(true);
      }
    };

    checkLoggedInStatus();
  }, []);

  return (
    <nav id="header" className="w-full z-30 top-10 py-1 bg-teal-500 shadow-lg">
      <div className="w-full flex items-center justify-between mt-0 px-6 py-2">
        <label
          htmlFor="menu-toggle"
          className="cursor-pointer md:hidden block"
          onClick={toggleMobileMenu}
        >
          <svg
            className="fill-current text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <title>menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </label>
        <input className="hidden" type="checkbox" id="menu-toggle" />

        <div
          className={`md:hidden absolute top-16 left-0 right-0 bg-white z-20 ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
          id="mobile-menu"
        >
          <ul className="text-center py-2">
            <li>
              <a
                className="block no-underline hover:text-black py-2 text-lg"
                href="/"
              >
                Home
              </a>
            </li>
            <li>
              <a
                className="block no-underline hover:text-black py-2 text-lg"
                href="#"
              >
                New Book
              </a>
            </li>
          </ul>
        </div>

        <div
          className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1"
          id="menu"
        >
          <nav>
            <ul className="md:flex items-center justify-between text-base text-blue-600 pt-4 md:pt-0">
              <li>
                <a
                  className="inline-block no-underline hover:text-black text-lg py-2 px-4 lg:-ml-2 font-semibold text-gray-100"
                  href="/"
                >
                  Home
                </a>
              </li>
              {isLoggedIn && (
                <li>
                  <a
                    className="inline-block no-underline hover:text-black text-lg py-2 px-4 lg:-ml-2 font-semibold text-gray-100"
                    href="/newbook"
                  >
                    New Book
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div
          className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4"
          id="nav-content"
        >
          {!isLoggedIn && (
            <div className="auth flex items-center w-full md:w-full">
              <button
                className="bg-transparent text-gray-800 p-2 rounded border border-gray-300 mr-4 hover:bg-gray-100 hover:text-gray-700"
                onClick={openSignInModal}
              >
                Sign in
              </button>
              <a
                className="bg-blue-600 text-gray-200 p-2 rounded hover:bg-blue-500 hover:text-gray-100 mr-4"
                href="/register"
              >
                Sign up
              </a>
            </div>
          )}

          {isLoggedIn && (
            <div className="auth flex items-center w-full md:w-full">
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-gray-200 p-2 rounded hover:bg-blue-500 hover:text-gray-100"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        <SignInModal
          isOpen={isSignInModalOpen}
          onClose={closeSignInModal}
          onSubmit={fetchDataToApi}
        />
      </div>
    </nav>
  );
};

export default Navbar;
