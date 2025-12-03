// Simple CSS-based star background (fallback without tsParticles)
export function StarsBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Звёздное небо через CSS */}
      <div className="absolute inset-0 stars-layer-1"></div>
      <div className="absolute inset-0 stars-layer-2"></div>
      <div className="absolute inset-0 stars-layer-3"></div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes moveStars {
          from { transform: translateY(0); }
          to { transform: translateY(-100px); }
        }

        .stars-layer-1 {
          background-image:
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 90%, white, transparent);
          background-size: 200% 200%;
          background-position: 0 0;
          animation: twinkle 3s ease-in-out infinite;
        }

        .stars-layer-2 {
          background-image:
            radial-gradient(1px 1px at 10% 20%, #ffd700, transparent),
            radial-gradient(2px 2px at 40% 40%, #ffd700, transparent),
            radial-gradient(1px 1px at 70% 80%, #ffd700, transparent),
            radial-gradient(1px 1px at 85% 50%, #ffd700, transparent),
            radial-gradient(2px 2px at 25% 70%, #ffd700, transparent),
            radial-gradient(1px 1px at 55% 15%, #ffd700, transparent);
          background-size: 250% 250%;
          background-position: 0 0;
          animation: twinkle 4s ease-in-out infinite 0.5s;
        }

        .stars-layer-3 {
          background-image:
            radial-gradient(1px 1px at 30% 60%, #7c3aed, transparent),
            radial-gradient(2px 2px at 65% 25%, #7c3aed, transparent),
            radial-gradient(1px 1px at 45% 85%, #7c3aed, transparent),
            radial-gradient(1px 1px at 75% 45%, #7c3aed, transparent),
            radial-gradient(2px 2px at 12% 55%, #7c3aed, transparent);
          background-size: 300% 300%;
          background-position: 0 0;
          animation: twinkle 5s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  )
}
