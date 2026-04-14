// components/Navbar.js
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { Home, MapPin, BarChart2, Phone, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check demo login first
    if (localStorage.getItem("isDemoLoggedIn") === "true") {
      setIsLoggedIn(true);
      return;
    }

    fetch("http://localhost:3200/check-adlogin", {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) {
          setIsLoggedIn(false);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data?.loggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  function handleLogout() {
    localStorage.removeItem("isDemoLoggedIn");
    fetch("http://localhost:3200/logoutmain", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.message);
        setIsLoggedIn(false);
        navigate("/");
      })
      .catch(() => {
        setIsLoggedIn(false);
        navigate("/");
      });
  }

  return (
    <nav className={`navbar navbar-expand-lg sticky-top premium-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-dark" to="/">
          <div className="brand-logo">
            <Heart size={18} fill="currentColor" />
          </div>
          <span style={{ fontSize: "1.2rem", fontFamily: "var(--hc-font-heading)", fontWeight: 800, letterSpacing: "-0.3px" }}>
            HopeConnect
          </span>
        </Link>

        <button className="navbar-toggler border-0" type="button" onClick={() => setExpanded(!expanded)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-1 align-items-lg-center">
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center gap-2 ${isActive("/") ? "active" : ""}`} to="/">
                <Home size={16} />Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center gap-2 ${isActive("/location") ? "active" : ""}`} to="/location">
                <MapPin size={16} />Find Orphanages
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center gap-2 ${isActive("/impact") ? "active" : ""}`} to="/impact">
                <BarChart2 size={16} />Our Impact
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link d-flex align-items-center gap-2 ${isActive("/contact") ? "active" : ""}`} to="/contact">
                <Phone size={16} />Contact
              </Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <span
                  className="nav-link d-flex align-items-center gap-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Logout
                </span>
              </li>
            )}
            <li className="nav-item ms-lg-2">
              <Link to="/location" className="donate-nav-btn btn d-flex align-items-center gap-2">
                <Heart size={14} fill="currentColor" /> Donate Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;