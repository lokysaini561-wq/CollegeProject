import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Users, Clock, ArrowLeft, AlertTriangle, Mail, Phone, CheckCircle, Heart, Shield } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Model from "./Model";
import { DUMMY_ORPHANAGES, getDemoImage, isDemoOrphanage } from "./dummyData";
import "./App.css";

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orphanage, setOrphanage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [usingDummy, setUsingDummy] = useState(false);

  const handleDonateClick = async () => {
    console.log("Donate button clicked. Orphanage:", orphanage);
    
    // 1. Check Demo Login First
    if (localStorage.getItem("isDemoLoggedIn") === "true") {
      const targetId = orphanage?._id || id || "demo-001";
      console.log("Already demo logged in. Navigating to:", targetId);
      navigate(`/donate/${targetId}`);
      return;
    }

    // 2. Check Backend Login
    try {
      console.log("Checking backend auth...");
      const res = await fetch("http://localhost:3200/check-adlogin", {
        credentials: "include"
      });
      const data = await res.json();
      if (data.loggedIn) {
        console.log("Backend logged in. Navigating...");
        navigate(`/donate/${orphanage?._id || "demo-001"}`);
      } else {
        console.log("Not logged in. Showing modal.");
        setShowLoginModal(true);
      }
    } catch (err) {
      console.log("Backend check failed (offline). Showing modal for fallback login.", err);
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    // Check if it's a demo orphanage
    if (id?.startsWith("demo-")) {
      const demoOrph = DUMMY_ORPHANAGES.find(o => o._id === id);
      if (demoOrph) {
        setOrphanage(demoOrph);
        setUsingDummy(true);
      }
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3200/orphanage/${id}`)
      .then(res => res.json())
      .then(data => { setOrphanage(data); setLoading(false); })
      .catch(err => {
        console.error(err);
        // Try to find in dummy data as absolute fallback
        const demoOrph = DUMMY_ORPHANAGES[0];
        setOrphanage(demoOrph);
        setUsingDummy(true);
        setLoading(false);
      });
  }, [id, navigate]);

  // Get correct image src
  const getHeroImg = () => {
    if (usingDummy || isDemoOrphanage(orphanage)) {
      const idx = DUMMY_ORPHANAGES.findIndex(o => o._id === orphanage._id);
      return getDemoImage(idx >= 0 ? idx : 0);
    }
    return `http://localhost:3200/uploads/${orphanage.photo}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
          <div className="text-center">
            <div className="premium-spinner mx-auto mb-3"></div>
            <p style={{ color: "var(--hc-text-muted)", fontWeight: 500 }}>Loading orphanage details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!orphanage) {
    return (
      <>
        <Navbar />
        <div className="empty-state" style={{ minHeight: "80vh" }}>
          <div className="empty-state-icon">
            <AlertTriangle size={36} style={{ color: "var(--hc-warning)" }} />
          </div>
          <h4 className="fw-bold" style={{ color: "var(--hc-navy)" }}>Orphanage not found</h4>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Model show={showLoginModal} onClose={() => setShowLoginModal(false)} orphanageId={orphanage?._id} />

      {/* Hero Image */}
      <div className="position-relative" style={{ height: "450px", overflow: "hidden" }}>
        <img src={getHeroImg()} alt={orphanage.name}
          className="w-100 h-100" style={{ objectFit: "cover", filter: "brightness(0.7)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.8) 0%, transparent 50%)" }}></div>

        <button className="btn position-absolute top-0 start-0 m-4 d-flex align-items-center gap-2 px-3 py-2 animate-fade-in"
          onClick={() => navigate(-1)}
          style={{
            background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
            color: "#fff", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "var(--hc-radius-full)", fontWeight: 500, fontSize: "0.9rem"
          }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="position-absolute bottom-0 start-0 p-5 animate-fade-in-up">
          <h1 className="fw-bold text-white mb-3" style={{ fontFamily: "var(--hc-font-heading)", fontSize: "2.5rem" }}>
            {orphanage.name}
          </h1>
          <div className="d-flex flex-wrap gap-3">
            {[
              { icon: <MapPin size={16} />, text: orphanage.location },
              { icon: <Users size={16} />, text: `${orphanage.children} Children` },
              { icon: <Clock size={16} />, text: `Founded ${orphanage.fyear}` }
            ].map((badge, i) => (
              <span key={i} className="d-flex align-items-center gap-2 px-3 py-2"
                style={{
                  background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
                  borderRadius: "var(--hc-radius-full)", color: "rgba(255,255,255,0.95)",
                  fontSize: "0.85rem", fontWeight: 500, border: "1px solid rgba(255,255,255,0.15)"
                }}>
                {badge.icon} {badge.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ marginTop: "-40px", position: "relative", zIndex: 10 }}>
        <div className="row g-4">

          {/* Left Column */}
          <div className="col-lg-8">
            {/* About */}
            <div className="premium-card p-4 mb-4 animate-fade-in-up" style={{ borderLeft: "4px solid var(--hc-primary)" }}>
              <h2 className="fw-bold mb-3" style={{ fontFamily: "var(--hc-font-heading)", color: "var(--hc-navy)" }}>About the Home</h2>
              <p style={{ color: "var(--hc-text-secondary)", lineHeight: 1.8 }}>{orphanage.des}</p>
              {orphanage.history && (
                <div className="mt-3 p-3" style={{ background: "var(--hc-primary-subtle)", borderRadius: "var(--hc-radius)", borderLeft: "3px solid var(--hc-primary)" }}>
                  <h6 className="fw-bold mb-1" style={{ color: "var(--hc-primary-dark)" }}>History</h6>
                  <p className="mb-0" style={{ color: "var(--hc-text-secondary)", fontSize: "0.9rem" }}>{orphanage.history}</p>
                </div>
              )}
            </div>

            {/* Urgent Needs */}
            {orphanage.urgentNeeds && orphanage.urgentNeeds.length > 0 && (
              <div className="premium-card p-4 mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlertTriangle size={22} style={{ color: "#ef4444" }} />
                  </div>
                  <h2 className="fw-bold mb-0" style={{ fontFamily: "var(--hc-font-heading)", color: "var(--hc-navy)" }}>
                    Current Urgent Needs
                  </h2>
                </div>
                <div className="d-flex flex-column gap-3">
                  {orphanage.urgentNeeds.map((need, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center p-3"
                      style={{
                        background: "var(--hc-surface-alt)", borderRadius: "var(--hc-radius)",
                        border: "1px solid var(--hc-border-light)", transition: "var(--hc-transition)"
                      }}>
                      <div>
                        <h6 className="fw-bold mb-1" style={{ color: "var(--hc-navy)" }}>{need.item}</h6>
                        <span className={`badge-urgency-${need.urgency === 'High' ? 'high' : need.urgency === 'Medium' ? 'medium' : 'low'}`}>
                          {need.urgency} Priority
                        </span>
                      </div>
                      <div className="text-end">
                        <small className="d-block" style={{ color: "var(--hc-text-muted)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>Required</small>
                        <span className="fw-bold" style={{ color: "var(--hc-navy)" }}>{need.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="premium-card p-4 mb-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h6 className="fw-bold d-flex align-items-center gap-2 mb-3"
                style={{ fontFamily: "var(--hc-font-heading)", color: "var(--hc-navy)" }}>
                <MapPin size={18} style={{ color: "var(--hc-primary)" }} /> Location
              </h6>
              <div className="map-container">
                <div className="ratio ratio-16x9">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(orphanage.location)}&output=embed`}
                    loading="lazy"
                    style={{ border: 0 }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-4">
            <div style={{ position: "sticky", top: "6rem" }}>
              {/* Donate Card */}
              <div className="premium-card p-4 mb-4 animate-fade-in-up"
                style={{ borderTop: "4px solid var(--hc-primary)" }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Heart size={20} style={{ color: "var(--hc-danger)" }} />
                  <h4 className="fw-bold mb-0" style={{ fontFamily: "var(--hc-font-heading)", color: "var(--hc-navy)" }}>Make a Difference</h4>
                </div>
                <p style={{ color: "var(--hc-text-secondary)", fontSize: "0.9rem" }}>
                  Your contribution supports {orphanage.children} children living here.
                </p>
                <button onClick={handleDonateClick} className="gradient-btn w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
                  style={{ padding: "14px" }}>
                  <Heart size={18} fill="currentColor" /> Donate Now
                </button>
                <p className="text-center small" style={{ color: "var(--hc-text-muted)" }}>Secure & Tax Deductible</p>

                {/* Contact Info */}
                <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--hc-border)" }}>
                  <h6 className="fw-bold mb-3" style={{ color: "var(--hc-navy)", fontFamily: "var(--hc-font-heading)" }}>Contact Information</h6>
                  {[
                    { icon: <MapPin size={16} />, text: orphanage.address },
                    { icon: <Mail size={16} />, text: orphanage.email },
                    { icon: <Phone size={16} />, text: orphanage.phone }
                  ].map((item, i) => (
                    <div key={i} className="d-flex align-items-center gap-3 mb-3">
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "var(--hc-primary-subtle)", color: "var(--hc-primary)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        {item.icon}
                      </div>
                      <span style={{ color: "var(--hc-text-secondary)", fontSize: "0.88rem" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Badge */}
              <div className="verified-badge d-flex align-items-start gap-3 p-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div style={{ flexShrink: 0 }}>
                  <Shield size={22} style={{ color: "#3b82f6" }} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: "#1e40af" }}>Verified Organization</h6>
                  <p className="small mb-0" style={{ color: "#3b82f6", lineHeight: 1.6 }}>
                    This orphanage has been vetted for transparency and child safety standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4"></div>
      <Footer />
    </>
  );
}

export default DetailPage;