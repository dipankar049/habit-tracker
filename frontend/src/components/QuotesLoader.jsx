import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import quotes from "../util/quotes";

export default function QuotesLoader() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-7rem)] flex flex-col justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-2xl p-8 max-w-xl w-full text-center border border-blue-100"
      >
        <p className="text-2xl font-semibold text-gray-800 leading-relaxed">
          “{quote.text}”
        </p>

        <motion.div
          className="mt-8 w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}
