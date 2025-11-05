import { useEffect, useRef } from "react";

export default function InternshipMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 51.1282, lng: 71.4304 },
        zoom: 10,
      });

      new window.google.maps.Marker({
        position: { lat: 51.1282, lng: 71.4304 },
        map,
        title: "Internship Opportunity",
      });
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Internship Map</h2>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
      />
    </div>
  );
}
