import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

export default function InternshipMap(){
  const center = { lat: 43.238949, lng: 76.889709 }; // Almaty example
  const containerStyle = { width: "100%", height: "70vh" };
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div style={{padding:12}}>
      <h2>Internship Map</h2>
      <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          <Marker position={center} title="Example Company" />
          {/* Later: map company documents from Firestore to markers */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
