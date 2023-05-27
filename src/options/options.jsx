import React from "react";
import { createRoot } from "react-dom/client";
import "./options.css";

const Options = () => {
  return (
    <div className="w-ful h-full flex justify-center">
      <div className="text-[2rem] text-[white]">Options</div>
    </div>
  );
};

createRoot(document.getElementById("react-target")).render(<Options />);
