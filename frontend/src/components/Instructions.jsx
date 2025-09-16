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
    <div className="text-end p-4 text-red-600 text-sm">
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
