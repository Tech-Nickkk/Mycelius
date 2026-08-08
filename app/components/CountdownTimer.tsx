"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export interface CountdownTimerProps {
  launchDate?: string;
  timerTitle?: string;
  expiredMessage?: string;
  showTimer?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CountdownTimer({
  launchDate,
  timerTitle = "NEXT DROP RELEASES IN",
  expiredMessage = "LIMITED DROP IS LIVE NOW",
  showTimer = true,
}: CountdownTimerProps) {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    let targetTimeMs: number;
    if (launchDate) {
      const parsed = new Date(launchDate).getTime();
      targetTimeMs = !isNaN(parsed) ? parsed : Date.now() + 7 * 24 * 60 * 60 * 1000;
    } else {
      targetTimeMs = Date.now() + 7 * 24 * 60 * 60 * 1000;
    }

    const calculateTimeLeft = (): TimeLeft => {
      const now = Date.now();
      const diff = targetTimeMs - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        isExpired: false,
      };
    };

    const animId = requestAnimationFrame(() => {
      setTimeLeft(calculateTimeLeft());
    });

    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      if (updated.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(timer);
    };
  }, [launchDate]);

  if (!showTimer) return null;

  const padZero = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="w-full flex flex-col items-center justify-center mt-8 sm:mt-12 md:mt-14 mb-1 z-20 pointer-events-auto select-none px-4">
      {/* Outer Pill Container with Continuous Animated Border Beam */}
      <div className="relative group p-[1px] rounded-full overflow-hidden max-w-fit w-full shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        {/* Infinite rotating glowing beam */}
        <div className="absolute inset-[-150%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_240deg,#F15B20_310deg,transparent_360deg)] opacity-90" />

        {/* Subtle border backing */}
        <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none" />

        {/* Inner Content Box */}
        <div className="relative bg-[#171512]/95 backdrop-blur-2xl rounded-full px-5 py-3 sm:px-8 sm:py-3.5 flex flex-col items-center gap-1.5 sm:gap-2 transition-all duration-500">
          {/* Title Header with pulse dot */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F15B20] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F15B20]"></span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-[#D4D0C9] uppercase font-avenir-next">
              {timeLeft.isExpired ? "DROP STATUS" : timerTitle}
            </span>
          </div>

          {/* Countdown display or Live message */}
          {mounted && timeLeft.isExpired ? (
            <div className="flex items-center gap-1.5 py-1 px-4 rounded-full bg-[#F15B20]/15 border border-[#F15B20]/40 text-[#F15B20]">
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase font-avenir-next">
                {expiredMessage}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2.5 sm:gap-5 font-kodchasan">
              {/* Days */}
              <div className="flex flex-col items-center min-w-[36px] sm:min-w-[44px]">
                <span className="text-xl sm:text-2xl md:text-3xl font-extralight tracking-tight text-white leading-none">
                  {mounted ? padZero(timeLeft.days) : "00"}
                </span>
                <span className="text-[7.5px] sm:text-[8.5px] font-medium tracking-[0.18em] text-[#A19D96] uppercase font-avenir-next mt-1">
                  Days
                </span>
              </div>

              <span className="text-base sm:text-lg font-light text-[#F15B20] -mt-3 opacity-80">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center min-w-[36px] sm:min-w-[44px]">
                <span className="text-xl sm:text-2xl md:text-3xl font-extralight tracking-tight text-white leading-none">
                  {mounted ? padZero(timeLeft.hours) : "00"}
                </span>
                <span className="text-[7.5px] sm:text-[8.5px] font-medium tracking-[0.18em] text-[#A19D96] uppercase font-avenir-next mt-1">
                  Hours
                </span>
              </div>

              <span className="text-base sm:text-lg font-light text-[#F15B20] -mt-3 opacity-80">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center min-w-[36px] sm:min-w-[44px]">
                <span className="text-xl sm:text-2xl md:text-3xl font-extralight tracking-tight text-white leading-none">
                  {mounted ? padZero(timeLeft.minutes) : "00"}
                </span>
                <span className="text-[7.5px] sm:text-[8.5px] font-medium tracking-[0.18em] text-[#A19D96] uppercase font-avenir-next mt-1">
                  Mins
                </span>
              </div>

              <span className="text-base sm:text-lg font-light text-[#F15B20] -mt-3 opacity-80">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center min-w-[36px] sm:min-w-[44px]">
                <span className="text-xl sm:text-2xl md:text-3xl font-extralight tracking-tight text-[#F15B20] leading-none">
                  {mounted ? padZero(timeLeft.seconds) : "00"}
                </span>
                <span className="text-[7.5px] sm:text-[8.5px] font-medium tracking-[0.18em] text-[#A19D96] uppercase font-avenir-next mt-1">
                  Secs
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
