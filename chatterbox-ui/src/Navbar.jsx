// Navbar.jsx
import clsx from "clsx";
import leleVoice from "./assets/leleVoice.png";

export default function Navbar({ page, setPage }) {
  const menu = [
    { label: "TTS", key: "tts" },
    { label: "Output", key: "output" },
  ];

  return (
    <div className="bg-blue-500/10 backdrop-blur-sm text-gray-100 shadow-md">
      <div className="flex items-center justify-center px-4 sm:px-8 py-3 gap-20">
        {/* Logo + Nome */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center  p-1 max-w-24">
            <img
              src={leleVoice}
              alt="Lele Voice logo"
              className="w-full rounded-full"
            />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold">
              Text to <span className="text-blue-400">Speech</span>
            </span>
            <span className="text-sm text-gray-400">
              Multilingual TTS Interface
            </span>
          </div>
        </div>

        {/* Menu */}
        <div className="flex items-center gap-4 sm:gap-6 text-sm">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={clsx(
                "transition-all pb-0.5 border-b-2",
                page === item.key
                  ? "text-blue-400 border-blue-400 text-base"
                  : "text-gray-400 border-transparent hover:text-blue-200 hover:border-blue-300"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
