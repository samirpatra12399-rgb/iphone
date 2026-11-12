import React from 'react';

interface IPhoneShellProps {
  children: React.ReactNode;
  wallpaperUrl: string;
  isFrameMode: boolean;
}

export const IPhoneShell: React.FC<IPhoneShellProps> = ({
  children,
  wallpaperUrl,
  isFrameMode,
}) => {
  if (!isFrameMode) {
    // Edge-to-edge Fullscreen Mobile View (turns your phone directly into an iPhone lock screen)
    return (
      <div
        style={{ backgroundImage: `url(${wallpaperUrl})` }}
        className="w-full h-[100dvh] relative overflow-hidden bg-cover bg-center select-none flex flex-col justify-between"
      >
        {/* Subtle dark vignette overlay */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        <div className="relative z-10 w-full h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden pt-[env(safe-area-inset-top,10px)] pb-[env(safe-area-inset-bottom,14px)]">
          {children}
        </div>
      </div>
    );
  }

  // Realistic iPhone 16 Pro Frame Shell (Desktop / Tablet / Mockup view)
  return (
    <div className="relative select-none py-4 sm:py-6 flex items-center justify-center max-w-full overflow-hidden">
      <div className="relative transform scale-[0.80] xs:scale-[0.88] sm:scale-95 md:scale-100 origin-center transition-transform">
        {/* Physical Hardware Buttons (Side Buttons) */}
        {/* Left: Action Button */}
        <div className="absolute -left-[5px] top-[140px] w-[5px] h-[30px] bg-[#3a3a3e] rounded-l-[3px] shadow-sm"></div>
        {/* Left: Volume Up */}
        <div className="absolute -left-[5px] top-[190px] w-[5px] h-[52px] bg-[#3a3a3e] rounded-l-[3px] shadow-sm"></div>
        {/* Left: Volume Down */}
        <div className="absolute -left-[5px] top-[255px] w-[5px] h-[52px] bg-[#3a3a3e] rounded-l-[3px] shadow-sm"></div>
        {/* Right: Side Power / Lock Button */}
        <div className="absolute -right-[5px] top-[200px] w-[5px] h-[75px] bg-[#3a3a3e] rounded-r-[3px] shadow-sm"></div>

        {/* Titanium Outer Chassis */}
        <div className="relative w-[392px] h-[832px] rounded-[56px] p-[10px] bg-gradient-to-b from-[#3a3a3f] via-[#242428] to-[#1a1a1c] shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-white/10 flex flex-col">
          {/* Black Bezel Frame */}
          <div className="w-full h-full rounded-[47px] bg-black p-[3px] overflow-hidden relative shadow-inner">
            {/* Active Screen Display */}
            <div
              style={{ backgroundImage: `url(${wallpaperUrl})` }}
              className="w-full h-full rounded-[44px] overflow-hidden relative bg-cover bg-center flex flex-col justify-between shadow-2xl"
            >
              {/* Subtle Screen Reflection Glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.08] pointer-events-none z-40 rounded-[44px]" />

              {/* Dark contrast gradient */}
              <div className="absolute inset-0 bg-black/25 pointer-events-none z-0" />

              {/* Content inside screen */}
              <div className="relative z-10 w-full h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

