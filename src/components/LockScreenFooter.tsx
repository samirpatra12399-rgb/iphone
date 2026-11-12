import React, { useState } from 'react';
import { Flashlight, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/audio';

interface LockScreenFooterProps {
  onCameraTrigger?: () => void;
}

export const LockScreenFooter: React.FC<LockScreenFooterProps> = ({ onCameraTrigger }) => {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [showCameraFlash, setShowCameraFlash] = useState(false);

  const toggleFlashlight = () => {
    soundManager.playFlashlightClick();
    setFlashlightOn((prev) => !prev);
  };

  const handleCameraClick = () => {
    soundManager.playCameraShutter();
    setShowCameraFlash(true);
    setTimeout(() => setShowCameraFlash(false), 200);
    if (onCameraTrigger) onCameraTrigger();
  };

  return (
    <>
      {/* Simulated Flashlight Beam Glow on screen */}
      <AnimatePresence>
        {flashlightOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-40 bg-gradient-to-t from-white/35 via-white/10 to-transparent mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Simulated Camera Flash */}
      <AnimatePresence>
        {showCameraFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute inset-0 z-50 bg-white"
          />
        )}
      </AnimatePresence>

      {/* Footer Controls Container */}
      <div className="absolute bottom-2 inset-x-0 z-30 flex flex-col items-center select-none pointer-events-none">
        {/* Flashlight & Camera Quick Buttons */}
        <div className="w-full flex items-center justify-between px-10 mb-5 pointer-events-auto">
          {/* Flashlight Button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={toggleFlashlight}
            className={`w-[50px] h-[50px] rounded-full flex items-center justify-center backdrop-blur-xl border border-white/15 transition-all shadow-lg ${
              flashlightOn
                ? 'bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.85)]'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            title="Toggle Flashlight"
          >
            <Flashlight size={21} strokeWidth={2.2} />
          </motion.button>

          {/* Camera Button */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleCameraClick}
            className="w-[50px] h-[50px] rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xl border border-white/15 shadow-lg active:bg-white active:text-black transition-all"
            title="Open Camera"
          >
            <Camera size={21} strokeWidth={2.2} />
          </motion.button>
        </div>

        {/* iOS Home Bar Indicator */}
        <div className="flex flex-col items-center">
          <div className="w-[134px] h-[5px] bg-white rounded-full opacity-85 shadow-sm"></div>
        </div>
      </div>
    </>
  );
};

