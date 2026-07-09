'use client';

import { useEffect, useState } from 'react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 520);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-5 right-5 z-[950] rounded-full border border-gray-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-normal text-gray-950 shadow-lg shadow-gray-950/10 transition-all hover:-translate-y-0.5 hover:border-gray-950 hover:bg-gray-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 ${
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      Top
    </button>
  );
}
