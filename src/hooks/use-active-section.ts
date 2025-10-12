'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useActiveSection(
  sectionIds: string[],
  options?: IntersectionObserverInit
) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  }, []);

  useEffect(() => {
    const observerOptions = options || {
      rootMargin: '-20% 0px -80% 0px',
    };

    observer.current = new IntersectionObserver(handleObserver, observerOptions);
    const currentObserver = observer.current;

    const elements = sectionIds.map(id => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    
    elements.forEach((el) => currentObserver.observe(el));

    return () => {
      elements.forEach((el) => currentObserver.unobserve(el));
    };
  }, [sectionIds, options, handleObserver]);

  return activeSection;
}
