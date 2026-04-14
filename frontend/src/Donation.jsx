import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Apple, Shirt, BookOpen, Home, Package, Check, ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Swal from "sweetalert2";
import "./App.css";

const DonationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orphanage, setOrphanage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [quan, setQuan] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3200/orphanage/${id}`)
      .then(res => res.json())
      .then(data => { setOrphanage(data); setLoading(false); })
      .catch(err => { console.error(err); navigate("/find"); });
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || !quan) { alert("Please fill in quantity and message"); return; }
    setSubmitting(true);
    fetch("http://localhost:3200/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ orphanageId: orphanage._id, selectedType, name: name || "Anonymous", quan, quantity }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          setStep(3);
          Toast.fire({ icon: "success", title: "🎁 Donation Request Received!!" });
          setName(""); setQuan(""); setQuantity("");
        } else { alert(data.message); }
        setSubmitting(false);
      })
      .catch((err) => { console.error(err); alert("Something went wrong!"); setSubmitting(false); });
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Check demo login first
      if (localStorage.getItem("isDemoLoggedIn") === "true") {
        setIsLoggedIn(true);
        return;
      }

      try {
        const res = await fetch("http://localhost:3200/check-adlogin", { credentials: "include" });
        if (res.status === 401) {
          setIsLoggedIn(false);
        } else {
          const data = await res.json();
          setIsLoggedIn(data?.loggedIn || false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn === false) {
      // Small delay to allow state to settle
      const timer = setTimeout(() => {
        if (localStorage.getItem("isDemoLoggedIn") === "true") {
          setIsLoggedIn(true);
        } else {
          navigate("/");
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn === null) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="premium-spinner"></div>
      </div>
    );
  }

  const Toast = Swal.mixin({ toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
          <div className="text-center">
            <div className="premium-spinner mx-auto mb-3"></div>
            <p style={{ color: "var(--hc-text-muted)" }}>Loading orphanage details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!orphanage) {
    return (<><Navbar /><div className="empty-state" style={{ minHeight: "80vh" }}><h4>Orphanage not found</h4></div><Footer /></>);
  }

  const donationOptions = [
    { type: 'Food', icon: <Apple size={28} />, label: "Food & Nutrition", color: "#22c55e" },
    { type: 'Clothes', icon: <Shirt size={28} />, label: "Clothes & Wearables", color: "#3b82f6" },
    { type: 'Education', icon: <BookOpen size={28} />, label: "Education Materials", color: "#f59e0b" },
    { type: 'Shelter', icon: <Home size={28} />, label: "Shelter Supplies", color: "#8b5cf6" },
    { type: 'Other', icon: <Package size={28} />, label: "Other Supplies", color: "#64748b" },
  ];

  return (
    <>
      <Navbar />
      <div style={{ background: "var(--hc-surface-alt)", minHeight: "80vh" }} className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">

              {/* Step Indicator */}
              <div className="step-indicator mb-4 animate-fade-in">
                {[
                  { num: 1, label: "Select Type" },
                  { num: 2, label: "Details" },
                  { num: 3, label: "Complete" }
                ].map((s) => (
                  <div key={s.num} className={`step-item ${step >= s.num ? (step > s.num ? 'completed' : 'active') : ''}`}>
                    <div className="step-circle">
                      {step > s.num ? <Check size={16} /> : s.num}
                    </div>
                    <span className="step-label">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="premium-card overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="p-4 text-center" style={{ background: "var(--hc-gradient-dark)", color: "#fff" }}>
                  <h2 className="fw-bold mb-1" style={{ fontFamily: "var(--hc-font-heading)", fontSize: "1.4rem" }}>
                    Donate Supplies to {orphanage.name}
                  </h2>
                  <p className="small mb-0" style={{ color: "rgba(255,255,255,0.6)" }}>
                    We only accept material supplies. No monetary donations.
                  </p>
                </div>

                <div className="p-4">
                  {/* Step 1 - Select Type */}
                  {step === 1 && (
                    <div className="animate-fade-in-up">
                      <h5 className="fw-bold text-center mb-4" style={{ fontFamily: "var(--hc-font-heading)", color: "var(--hc-navy)" }}>
                        What supplies do you want to donate?
                      </h5>
                      <div className="row g-3">
                        {donationOptions.map((opt, i) => (
                          <div className="col-6" key={opt.type}
                            style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.08}s both` }}>
                            <div className="donation-type-card"
                              onClick={() => { setSelectedType(opt.type); setStep(2); }}>
                              <div style={{ color: opt.color, marginBottom: 8 }}>
                                {React.cloneElement(opt.icon, { size: 32 })}
                              </div>
                              <span>{opt.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 - Details */}
                  {step === 2 && (
                    <form onSubmit={handleSubmit} className="animate-fade-in-up">
                      <div className="p-3 mb-4" style={{
                        background: "rgba(13,148,136,0.06)", borderRadius: "var(--hc-radius)",
                        borderLeft: "3px solid var(--hc-primary)", fontSize: "0.88rem", color: "var(--hc-text-secondary)"
                      }}>
                        <strong style={{ color: "var(--hc-primary-dark)" }}>Note:</strong> Please describe the items clearly. Our team will review and contact you.
                      </div>

                      <h5 className="fw-bold mb-4" style={{ fontFamily: "var(--hc-font-heading)", color: "var(--hc-navy)" }}>
                        Item Details
                      </h5>

                      <div className="mb-3">
                        <label className="form-label fw-semibold small" style={{ color: "var(--hc-text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Donation Type
                        </label>
                        <input type="text" className="premium-input form-control" value={selectedType} readOnly />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold small" style={{ color: "var(--hc-text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Description
                        </label>
                        <textarea required rows={3} className="premium-input form-control"
                          placeholder="e.g. 10 Winter Jackets, 2 Boxes of Textbooks"
                          value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold small" style={{ color: "var(--hc-text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Quantity (pcs, kg)
                        </label>
                        <input type="text" className="premium-input form-control"
                          placeholder="e.g. 10 Pcs, 50 lit."
                          value={quan} onChange={(e) => setQuan(e.target.value)} />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold small" style={{ color: "var(--hc-text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Your Name (Optional)
                        </label>
                        <input type="text" className="premium-input form-control"
                          placeholder="Leave empty to donate anonymously"
                          value={name} onChange={(e) => setName(e.target.value)} />
                      </div>

                      <div className="d-flex gap-3">
                        <button type="button" onClick={() => setStep(1)}
                          className="btn px-4 py-3"
                          style={{ flex: "1 1 33%", borderRadius: "var(--hc-radius)", background: "var(--hc-surface-alt)", fontWeight: 600, color: "var(--hc-text-secondary)" }}>
                          <ArrowLeft size={16} className="me-2" /> Back
                        </button>
                        <button type="submit" className="gradient-btn" disabled={submitting}
                          style={{ flex: "1 1 67%", padding: "14px", borderRadius: "var(--hc-radius)" }}>
                          {submitting ? (
                            <span className="d-flex align-items-center justify-content-center gap-2">
                              <div className="spinner-border spinner-border-sm"></div> Submitting...
                            </span>
                          ) : (
                            <span className="d-flex align-items-center justify-content-center gap-2">
                              <Heart size={16} fill="currentColor" /> Submit Request
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Step 3 - Success */}
                  {step === 3 && (
                    <div className="text-center py-5 animate-bounce-in">
                      <div className="d-inline-flex align-items-center justify-content-center mb-4"
                        style={{
                          width: 80, height: 80, borderRadius: "50%",
                          background: "rgba(34,197,94,0.1)"
                        }}>
                        <CheckCircle size={40} style={{ color: "#22c55e" }} />
                      </div>
                      <h3 className="fw-bold mb-2" style={{ fontFamily: "var(--hc-font-heading)", color: "var(--hc-navy)" }}>
                        Request Submitted!
                      </h3>
                      <p style={{ color: "var(--hc-text-secondary)", maxWidth: 400, margin: "0 auto" }}>
                        Thank you for your kindness! We've received your request to donate <strong>{selectedType}</strong>.
                        Our team will contact you shortly.
                      </p>
                      <div className="d-flex flex-column gap-2 mt-4" style={{ maxWidth: 280, margin: "0 auto" }}>
                        <button onClick={() => navigate('/impact')} className="gradient-btn-dark"
                          style={{ padding: "12px", borderRadius: "var(--hc-radius)" }}>
                          See Impact Dashboard
                        </button>
                        <button onClick={() => navigate('/')}
                          style={{
                            background: "none", border: "none", color: "var(--hc-primary)",
                            fontWeight: 600, cursor: "pointer", padding: "10px"
                          }}>
                          Return Home
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonationPage;