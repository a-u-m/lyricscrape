import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";

const Popup = () => {
  let fetched = false;
  const [lyricscrapeSettings, setLyricscrapeSettings] = useState({
    fontSize: null,
    lineHeight: null,
  });
  useEffect(() => {
    chrome.storage.sync.get(["lyricscrape"], function (result) {
      console.log(result.lyricscrape);
      setLyricscrapeSettings(result.lyricscrape);
    });
  }, []);
  return (
    <div className="w-full h-full text-[white] flex flex-col">
      <div id="lv-1" className="text-[1rem] p-2">
        <div className="flex flex-row items-center">
          <div className="w-[1.9rem] mr-1">
            <img className="w-full h-auto" src="logo3.png" />
          </div>
          <span className="font-thin">lyric</span>
          <span className="font-bold">scrape</span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row rounded p-1 pl-2 m-2 mt-0 mb-1 bg-[#333333]">
          <div id="lv2" className="text-[#c1c1c1] flex-grow w-[30%]">
            <label htmlFor="font-size-range">font size</label>
          </div>
          <div
            id="lv2"
            className="text-[#c1c1c1] flex-grow w-[70%] items-center "
          >
            <input
              id="default-range"
              type="range"
              min="12"
              max="36"
              value={
                (lyricscrapeSettings && lyricscrapeSettings.fontSize) || 12
              }
              step="4"
              onChange={(e) => {
                chrome.storage.sync.set({
                  lyricscrape: {
                    ...lyricscrapeSettings,
                    fontSize: e.target.value,
                  },
                });
                setLyricscrapeSettings((prevState) => {
                  return { ...prevState, fontSize: e.target.value };
                });
              }}
              className="w-full h-[2px] accent-[#fff] rounded-lg appearance-none cursor-pointer bg-[#ea5356]"
            />
          </div>
        </div>
        <div className="flex flex-row rounded p-1 pl-2 m-2 mt-0 mb-2 bg-[#333333]">
          <div id="lv2" className="text-[#c1c1c1] flex-grow w-[30%]">
            <label htmlFor="font-size-range">line height</label>
          </div>
          <div
            id="lv2"
            className="text-[#c1c1c1] flex-grow w-[70%] items-center"
          >
            <input
              id="default-range"
              type="range"
              min="1"
              max="2.05"
              value={
                (lyricscrapeSettings && lyricscrapeSettings.lineHeight) || 1.45
              }
              step="0.15"
              onChange={(e) => {
                chrome.storage.sync.set({
                  lyricscrape: {
                    ...lyricscrapeSettings,
                    lineHeight: e.target.value,
                  },
                });
                setLyricscrapeSettings((prevState) => {
                  return { ...prevState, lineHeight: e.target.value };
                });
              }}
              className="w-full h-[2px] accent-[#fff] rounded-lg appearance-none cursor-pointer bg-[#ea5356]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

createRoot(document.getElementById("react-target")).render(<Popup />);
