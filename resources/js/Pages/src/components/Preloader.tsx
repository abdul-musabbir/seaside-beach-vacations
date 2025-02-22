import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className={`preloader ${fadeOut ? "fade-out" : ""}`}>
      <div className="preloader-content">
        <div className="hotel-loader" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome to Seaside Beatch Vacations
          </h2>
          <p className="loading-text text-gray-600">
            Preparing your perfect getaway...
          </p>
        </div>
      </div>
    </div>
  );
}
