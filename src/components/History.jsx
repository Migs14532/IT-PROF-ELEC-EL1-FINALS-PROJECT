import React, { useState, useEffect } from "react";
import { ChevronLeft, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("bookingHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const handleDelete = (orderId) => {
    const updatedHistory = history.filter((order) => order.orderId !== orderId);
    setHistory(updatedHistory);
    localStorage.setItem("bookingHistory", JSON.stringify(updatedHistory));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-50 px-4 py-8 relative">
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-300 transition cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700 hover:text-gray-900 transition" />
      </button>
      
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500 mb-8 text-center">History</h1>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4 sm:p-6 space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-400 text-sm italic text-center">No orders yet.</p>
        ) : (
          history.map((order) => (
            <div key={order.orderId} className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <p className="text-black font-medium text-sm sm:text-base">{order.orderId}</p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {order.services
                    .map(
                      (s) =>
                        `${s.name} ${
                          s.unit === "per kg" && s.quantity ? `${s.quantity} kg` : ""
                        } ₱${s.price}`
                    )
                    .join(", ")}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => navigate("/receipt", { state: order })}
                  className="text-blue-500 hover:text-blue-600 transition cursor-pointer"
                >
                  <Eye className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleDelete(order.orderId)}
                  className="text-red-500 hover:text-red-600 transition cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
