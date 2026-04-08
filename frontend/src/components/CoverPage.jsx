import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import coverImage from '../assets/2e4f9049-0dc4-4feb-8d6e-771a9b778a9b.jpeg';

const SLIDE_MS = 650;

export default function CoverPage() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isClosing) return;

    const t = window.setTimeout(() => {
      setIsVisible(false);
      navigate('/dashboard');
    }, SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [isClosing, navigate]);

  if (!isVisible) return null;

  return (
    <div
      className="relative overflow-hidden transition-all duration-700 ease-in-out"
      style={{
        width: '100vw',
        height: isClosing ? 0 : '100vh',
        opacity: isClosing ? 0 : 1,
        transform: isClosing ? 'translateY(-100%)' : 'translateY(0)',
        marginLeft: 'calc(50% - 50vw)',
      }}
    >
      <div
        className="relative w-full h-full bg-cover bg-center group"
        style={{
          backgroundImage: `url(${coverImage})`,
          borderRadius: '0',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 text-center px-6">
          <div className="absolute mt-30  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              className="text-2xl sm:text-5xl font-bold text-white origin-center"
            >
              Carbon Footprint Tracker
            </span>
          </div>
        </div>

        <button
          type="button"
          className="absolute left-1/2 -translate-x-1/2 bottom-10 flex flex-col items-center gap-2 text-white font-medium cursor-pointer focus:outline-none focus-visible:outline-none"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsClosing(true)}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          <span className="text-lg font-bold">click here to get started</span>
          <span
            aria-hidden="true"
            className="flex items-center justify-center"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="origin-center"
              style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

