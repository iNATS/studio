"use client";

import { useState, useEffect, useRef } from 'react';

export function useActiveSection(sectionIds: string[], options?: IntersectionObserverInit): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
            const visibleSection = entry.target.id;
            // Check if element is in the top half of the screen
            const rect = entry.boundingClientRect;
            if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                setActiveSection(visibleSection);
            }
        }
      });

      // Fallback for when no section is in the middle of the screen
      const intersectingEntries = entries.filter(e => e.isIntersecting);
      if (intersectingEntries.length > 0) {
        // Find the one with the largest intersection ratio
        intersectingEntries.sort((a,b) => b.intersectionRatio - a.intersectionRatio);
        const mostVisible = intersectingEntries[0];
        if (activeSection !== mostVisible.target.id) {
            // A simple check to see if we should update based on visibility at all
            const rect = mostVisible.boundingClientRect;
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                setActiveSection(mostVisible.target.id);
            }
        }
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: '-50% 0px -50% 0px', // A horizontal line in the middle of the screen
      threshold: 0,
      ...options,
    });

    const currentObserver = observerRef.current;
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        currentObserver.observe(element);
      }
    });

    return () => {
      currentObserver.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds]);

  return activeSection;
}
