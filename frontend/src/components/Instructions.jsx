import React, { useEffect, useState } from "react";

export default function Instructions() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check screen size once when component mounts
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="text-right mt-4 text-gray-800 text-xs sm:text-sm space-y-1">
      {isMobile ? (
        <>
          <p>*Long press on cell to add event</p>
          <p>*Tap on event to mark complete or incomplete</p>
          <p>*Long press on event to delete</p>
        </>
      ) : (
        <>
          <p>*Click on cell to add event</p>
          <p>*Click on event to mark complete or incomplete</p>
          <p>*Long press on event to delete</p>
        </>
      )}
    </div>
  );
}
