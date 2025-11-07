import { useEffect, useRef, useState } from "react";
import { FiMapPin } from "react-icons/fi";
import styles from "./InternshipMap.module.css";

export default function InternshipMap() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [query, setQuery] = useState("");
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const initMap = () => {
      const m = new window.google.maps.Map(mapRef.current, {
        center: { lat: 51.1282, lng: 71.4304 },
        zoom: 11,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
        ],
      });
      setMap(m);
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

  const handleSearch = async () => {
    if (!map || !query.trim()) return;

    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const response = await fetch(
      `https://api.hh.ru/vacancies?text=${query}&area=40`
    );
    const data = await response.json();

    const newMarkers = [];

    data.items.forEach((job) => {
      const coords = job.address?.lat && job.address?.lng;
      if (coords) {
        const marker = new window.google.maps.Marker({
          position: { lat: job.address.lat, lng: job.address.lng },
          map,
          title: job.name,
        });

        const info = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; font-family: Inter, sans-serif;">
              <h4 style="margin: 0 0 8px 0; color: #2d2d2d; font-size: 16px;">${job.name}</h4>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${job.employer.name}</p>
              <a href="${job.alternate_url}" target="_blank"
                 style="color: #ff5a6e; text-decoration: none; font-weight: 500;">
                View Job →
              </a>
            </div>
          `,
        });

        marker.addListener("click", () => info.open(map, marker));
        newMarkers.push(marker);
      }
    });

    setMarkers(newMarkers);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <FiMapPin />
          FIND <span className={styles.titleHighlight}>INTERNSHIPS</span> NEAR YOU
        </h2>
        <div className={styles.divider} />
      </div>

      <div className={styles.content}>
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Frontend, backend, data analyst..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.searchInput}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              Search
            </button>
          </div>
        </div>

        <div className={styles.mapContainer}>
          <div ref={mapRef} className={styles.mapWrapper} />
        </div>
      </div>
    </div>
  );
}