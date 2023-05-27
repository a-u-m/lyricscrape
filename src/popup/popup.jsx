import React from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";

const Popup = () => {
  return (
    <div className="w-ful h-full flex justify-center">
      <div className="text-[2rem] text-[white]">Lyrics</div>
    </div>
  );
};

createRoot(document.getElementById("react-target")).render(<Popup />);
