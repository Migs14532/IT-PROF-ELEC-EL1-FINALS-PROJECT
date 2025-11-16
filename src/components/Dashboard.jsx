import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import popular1 from "../assets/popular1.png";
import popular2 from "../assets/popular2.png";
import service1 from "../assets/service1.png";
import service2 from "../assets/service2.png";
import service3 from "../assets/service3.png";
import history from "../assets/history.png";
import booking from "../assets/booking-laundry.png";
import profile from "../assets/profile.png";

export default function Dashboard() {
  const navigate = useNavigate();

  // ----- State -----
  const [modalService, setModalService] = useState(null);
  const [seeAllModal, setSeeAllModal] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(null);

  const popularServices = [
    { id: 1, name: "Wash & Fold", rating: 4.8, image: popular1, description: "Standard washing, drying, and neatly folding clothes.", price: "₱50 per kg" },
    { id: 2, name: "Ironing and Pressing", rating: 4.5, image: popular2, description: "Ironing or pressing clothes only, to remove wrinkles and make them look neat.", price: "₱30 per item" },
  ];

  const services = [
    { id: 1, name: "Wash & Fold", icon: service1, description: "Standard washing, drying, and neatly folding clothes.", price: "₱50 per kg" },
    { id: 2, name: "Ironing & Pressing", icon: service2, description: "Ironing or pressing clothes only, to remove wrinkles and make them look neat.", price: "₱30 per item" },
    { id: 3, name: "Dry Cleaning", icon: service3, description: "Cleaning delicate or non-washable fabrics like suits, coats, and dresses using special solvents.", price: "₱150 per item" },
  ];

  // Bottom navigation
  const bottomNav = [
    { id: 1, icon: history, label: "History", action: () => navigate("/history") },
    { id: 2, icon: booking, label: "Booking Laundry", action: () => setShowBookingModal(true) },
    { id: 3, icon: profile, label: "Profile", action: () => navigate("/profile") },
  ];

  // Booking form
  const servicesList = [
    { name: "Wash & Fold", price: 50, unit: "per kg" },
    { name: "Iron Only", price: 30, unit: "per item" },
    { name: "Dry Cleaning", price: 150, unit: "per item" },
  ];

  const [bookingForm, setBookingForm] = useState({
    serviceType: "",
    price: 0,
    unit: "",
    quantity: 1,
    pickupDate: "",
    pickupTime: "",
  });

  // ----- Helpers -----
  const handleServiceChange = (e) => {
    const selected = servicesList.find(s => s.name === e.target.value);
    if (selected) {
      setBookingForm({ ...bookingForm, serviceType: selected.name, price: selected.price, unit: selected.unit, quantity: 1 });
    } else {
      setBookingForm({ ...bookingForm, serviceType: "", price: 0, unit: "", quantity: 1 });
    }
  };

  const handleBook = () => {
    if (!bookingForm.serviceType || !bookingForm.pickupDate || !bookingForm.pickupTime) {
      alert("Please fill all fields!");
      return;
    }
    const orderId = "ORD-" + Math.floor(Math.random() * 100000);
    setShowBookingModal(false);
    setShowOrderDetailsModal({ ...bookingForm, orderId });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [hourStr, min] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${min} ${ampm}`;
  };

  const handleProceedToPayment = (booking) => {
    const totalPrice = booking.price * (booking.unit === "per kg" ? booking.quantity : 1);
    setShowOrderDetailsModal(null);
    setShowPaymentModal({ ...booking, totalPrice, paymentMethod: "" });
  };

  const handlePlaceOrder = (booking) => {
    if (!booking.paymentMethod) booking.paymentMethod = "GCash";
    const servicesData = [
      {
        name: booking.serviceType,
        price: booking.price * (booking.quantity || 1),
        quantity: booking.quantity || 1,
        unit: booking.unit,
      },
    ];
    const receiptData = {
      orderId: booking.orderId,
      paymentId: "PMT-" + Math.floor(Math.random() * 100000),
      date: new Date().toLocaleDateString("en-US"),
      services: servicesData,
      status: "Paid",
    };
    const existingHistory = JSON.parse(localStorage.getItem("bookingHistory")) || [];
    localStorage.setItem("bookingHistory", JSON.stringify([...existingHistory, receiptData]));
    setShowPaymentModal(null);
    setShowReceiptModal(receiptData);
  };

  const totalCost = (services) => services.reduce((sum, s) => sum + (s.price || 0), 0);

  // ----- JSX -----
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col relative">

      {/* Back button */}
      <button onClick={() => navigate("/login")} className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-300 transition cursor-pointer">
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 pb-24 pt-12 md:pt-16">

        {/* Popular Services */}
        <section className="w-full max-w-5xl mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Popular Services</h2>
            <button className="text-black text-sm sm:text-base font-medium hover:text-blue-500 cursor-pointer transition"
              onClick={() => setSeeAllModal({ type: "popular", data: popularServices })}>See all</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularServices.map(service => (
              <div key={service.id} className="relative bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
                onClick={() => setModalService(service)}>
                <img src={service.image} alt={service.name} className="w-full h-40 sm:h-48 lg:h-56 object-cover" />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow">
                  <span className="text-sm font-semibold">{service.rating}</span>
                  <FaStar className="text-yellow-400 text-sm" />
                </div>
                <p className="text-center font-medium text-gray-700 py-2 text-sm sm:text-base">{service.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="w-full max-w-5xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Services</h2>
            <button className="text-black text-sm sm:text-base font-medium hover:text-blue-500 cursor-pointer transition"
              onClick={() => setSeeAllModal({ type: "services", data: services })}>See all</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 place-items-center">
            {services.map(service => (
              <div key={service.id} className="flex flex-col items-center bg-white rounded-2xl p-4 hover:shadow-md transition cursor-pointer w-24 sm:w-28"
                onClick={() => setModalService(service)}>
                <img src={service.icon} alt={service.name} className="w-10 h-10 sm:w-12 sm:h-12 mb-2 object-contain" />
                <p className="text-sm sm:text-base font-medium text-gray-700 text-center">{service.name}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white py-3 shadow-inner flex justify-around items-center md:rounded-t-2xl">
        {bottomNav.map(item => (
          <button key={item.id} onClick={item.action} className="flex flex-col items-center text-gray-700 cursor-pointer hover:text-blue-600 transition">
            <img src={item.icon} alt={item.label} className="w-6 h-6 mb-1 object-contain" />
            <span className="text-xs sm:text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* -- Modals (Booking, Order, Payment, Receipt, Individual, See All) -- */}
      {/* Individual Service Modal */}
      {modalService && (
        <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative shadow-lg">
            <button onClick={() => setModalService(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold cursor-pointer">✕</button>
            <img src={modalService.image || modalService.icon} alt={modalService.name} className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-lg font-semibold mb-2">{modalService.name}</h3>
            <p className="text-gray-600 mb-2">{modalService.description}</p>
            <p className="font-medium">{modalService.price}</p>
          </div>
        </div>
      )}

      {/* See All Modal */}
      {seeAllModal && (
        <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full relative shadow-lg">
            <button onClick={() => setSeeAllModal(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold cursor-pointer">✕</button>
            <h3 className="text-lg font-semibold mb-4">{seeAllModal.type === "popular" ? "All Popular Services" : "All Services"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {seeAllModal.data.map(service => (
                <div key={service.id} className="flex flex-col items-center bg-blue-50 rounded-2xl p-4 hover:shadow-md transition cursor-pointer"
                  onClick={() => { setModalService(service); setSeeAllModal(null); }}>
                  <img src={service.image || service.icon} alt={service.name} className="w-20 h-20 object-contain mb-2" />
                  <p className="font-medium text-gray-700 text-center">{service.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-lg">
            <button onClick={() => setShowBookingModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold cursor-pointer">✕</button>
            <h1 className="text-xl font-bold text-blue-500 mb-6 text-center">Booking Laundry</h1>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Service Type</label>
                <select value={bookingForm.serviceType} onChange={handleServiceChange}
                  className="w-full border border-blue-300 rounded-lg px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
                  <option value="">Choose an option</option>
                  {servicesList.map((s, i) => (
                    <option key={i} value={s.name}>{s.name} ₱{s.price} {s.unit}</option>
                  ))}
                </select>
              </div>

              {bookingForm.unit === "per kg" && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Quantity (kg)</label>
                  <input type="number" min="1" value={bookingForm.quantity} onChange={(e) => setBookingForm({ ...bookingForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full border border-blue-300 rounded-lg px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2">Pickup Date</label>
                <input type="date" value={bookingForm.pickupDate} onChange={(e) => setBookingForm({ ...bookingForm, pickupDate: e.target.value })}
                  className="w-full border border-blue-300 rounded-lg px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Pickup Time</label>
                <input type="time" value={bookingForm.pickupTime} onChange={(e) => setBookingForm({ ...bookingForm, pickupTime: e.target.value })}
                  className="w-full border border-blue-300 rounded-lg px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>

              <button onClick={handleBook} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold transition mt-4 cursor-pointer">Book Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetailsModal && (
        <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-lg">
            <button onClick={() => setShowOrderDetailsModal(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold cursor-pointer">✕</button>
            <h1 className="text-xl font-bold text-blue-500 mb-6 text-center">Order Details</h1>

            <div className="space-y-3">
              <div className="flex justify-between"><p className="text-gray-500 font-medium">Order ID:</p><p className="font-semibold">{showOrderDetailsModal.orderId}</p></div>
              <div className="flex justify-between"><p className="text-gray-500 font-medium">Status:</p><p className="font-semibold">{showOrderDetailsModal.status || "Pending"}</p></div>
              <div className="flex justify-between"><p className="text-gray-500 font-medium">Pickup Date:</p><p className="font-semibold">{formatDate(showOrderDetailsModal.pickupDate)}</p></div>
              <div className="flex justify-between"><p className="text-gray-500 font-medium">Pickup Time:</p><p className="font-semibold">{formatTime(showOrderDetailsModal.pickupTime)}</p></div>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-gray-500 font-medium mb-2">Service Type:</p>
                <div className="flex justify-between">
                  <p className="text-gray-700">{showOrderDetailsModal.serviceType} {showOrderDetailsModal.unit === "per kg" ? `${showOrderDetailsModal.quantity} kg` : ""}</p>
                  <p className="font-semibold">₱{showOrderDetailsModal.price * (showOrderDetailsModal.unit === "per kg" ? showOrderDetailsModal.quantity : 1)}</p>
                </div>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-3">
                <p className="text-gray-500 font-medium">Total:</p>
                <p className="font-semibold">₱{showOrderDetailsModal.price * (showOrderDetailsModal.unit === "per kg" ? showOrderDetailsModal.quantity : 1)}</p>
              </div>

              <button onClick={() => handleProceedToPayment(showOrderDetailsModal)} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold transition mt-4 cursor-pointer">Proceed to Payment</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-lg">
            <button onClick={() => setShowPaymentModal(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold cursor-pointer">✕</button>
            <h1 className="text-xl font-bold text-blue-500 mb-6 text-center">Payment</h1>

            <div className="space-y-4">
              <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
              <select value={showPaymentModal.paymentMethod || ""} 
                      onChange={(e) => setShowPaymentModal({ ...showPaymentModal, paymentMethod: e.target.value })}
                      className="w-full border border-blue-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
                <option value="">Select payment method</option>
                <option value="GCash">GCash</option>
                <option value="PayPal">PayPal</option>
                <option value="Card">Credit / Debit Card</option>
              </select>

              <button onClick={() => handlePlaceOrder(showPaymentModal)} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold transition mt-4 cursor-pointer">
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative shadow-lg">
            <button onClick={() => setShowReceiptModal(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold cursor-pointer">✕</button>
            <h1 className="text-xl font-bold text-blue-500 mb-6 text-center">Receipt</h1>

            <div className="space-y-3">
              <div className="flex justify-between"><p className="text-gray-500 font-medium">Order ID:</p><p className="font-semibold">{showReceiptModal.orderId}</p></div>
              <div className="flex justify-between"><p className="text-gray-500 font-medium">Payment ID:</p><p className="font-semibold">{showReceiptModal.paymentId}</p></div>
              <div className="flex justify-between"><p className="text-gray-500 font-medium">Date:</p><p className="font-semibold">{showReceiptModal.date}</p></div>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-gray-500 font-medium mb-2">Service Type:</p>
                {showReceiptModal.services.map((s, index) => (
                  <div key={index} className="flex justify-between">
                    <p className="text-gray-700">{s.name} {s.unit === "per kg" ? `${s.quantity} kg` : ""}</p>
                    <p className="font-semibold">₱{s.price}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-3">
                <p className="text-gray-500 font-medium">Total Cost:</p>
                <p className="font-semibold">₱{totalCost(showReceiptModal.services)}</p>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-500 font-medium">Status:</p>
                <p className="font-semibold text-green-600">{showReceiptModal.status}</p>
              </div>

              <button onClick={() => setShowReceiptModal(null)} 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold mt-4 transition cursor-pointer">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
