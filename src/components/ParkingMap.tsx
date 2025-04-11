
import { useState, useEffect } from "react";
import { ParkingSpot } from "@/types/parking";
import { 
  MapPin, 
  Car, 
  Clock, 
  IndianRupee, 
  Navigation 
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface ParkingMapProps {
  spots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  onSelectSpot: (spot: ParkingSpot) => void;
  userLocation?: { latitude: number; longitude: number };
}

const ParkingMap = ({ 
  spots, 
  selectedSpot, 
  onSelectSpot,
  userLocation
}: ParkingMapProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // In a real application, we would use a map library like Mapbox, Google Maps, or Leaflet
  // For now, we'll create a simplified map visualization
  
  // Get a list of available spots for display
  const availableSpots = spots.filter(spot => spot.available);
  const soonAvailableSpots = spots.filter(spot => !spot.available && spot.prediction.willBeAvailable);
  const unavailableSpots = spots.filter(spot => !spot.available && !spot.prediction.willBeAvailable);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper function to determine pin color based on spot status
  const getPinColor = (spot: ParkingSpot) => {
    if (spot.available) return "bg-green-500";
    if (spot.prediction.willBeAvailable) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (!mapLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-[400px] bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Simplified map representation */}
      <div className="absolute inset-0 bg-gray-200 grid grid-cols-12 grid-rows-12 gap-0.5">
        {Array.from({ length: 144 }).map((_, index) => (
          <div key={index} className="bg-gray-100"></div>
        ))}
      </div>
      
      {/* User location */}
      {userLocation && (
        <div 
          className="absolute z-20 animate-pulse" 
          style={{ 
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <Navigation className="h-6 w-6 text-blue-600" />
            <div className="absolute inset-0 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
          </div>
          <div className="text-xs font-bold text-blue-800 mt-1 bg-white px-1 rounded">You</div>
        </div>
      )}
      
      {/* Render parking spots */}
      {spots.map(spot => (
        <div 
          key={spot.id}
          className={`absolute cursor-pointer transition-all duration-300 hover:z-30 ${selectedSpot?.id === spot.id ? 'z-20 scale-110' : 'z-10'}`}
          style={{ 
            left: `${((spot.longitude - 72.8577) / 0.04) * 100}%`,
            top: `${((19.096 - spot.latitude) / 0.04) * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => onSelectSpot(spot)}
        >
          <div className="relative">
            <div className={`h-4 w-4 rounded-full ${getPinColor(spot)} shadow-md flex items-center justify-center`}>
              {spot.available && (
                <div className="h-2 w-2 bg-white rounded-full"></div>
              )}
            </div>
            
            {selectedSpot?.id === spot.id && (
              <Card className="absolute left-1/2 -translate-x-1/2 top-0 mt-4 p-2 w-48 z-30 text-xs shadow-lg">
                <div className="font-bold">{spot.address}</div>
                <div className="flex justify-between mt-1">
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-1 ${getPinColor(spot)}`}></div>
                    {spot.available ? "Available" : 
                      spot.prediction.willBeAvailable 
                        ? `Available in ${spot.prediction.inMinutes}m` 
                        : "Unavailable"}
                  </div>
                  {spot.distance !== undefined && (
                    <div className="text-gray-500">{spot.distance.toFixed(2)}km</div>
                  )}
                </div>
                
                <div className="flex mt-1 space-x-2 text-gray-600">
                  {spot.price !== null && (
                    <div className="flex items-center">
                      <IndianRupee className="h-3 w-3 mr-0.5" />
                      <span>{spot.price}/hr</span>
                    </div>
                  )}
                  
                  {spot.timeLimit !== null && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-0.5" />
                      <span>{spot.timeLimit}min</span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      ))}
      
      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-white p-2 rounded-lg shadow-md text-xs">
        <div className="font-bold mb-1">Parking Status</div>
        <div className="flex items-center mb-1">
          <div className="h-3 w-3 bg-green-500 rounded-full mr-1"></div>
          <span>Available ({availableSpots.length})</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="h-3 w-3 bg-yellow-500 rounded-full mr-1"></div>
          <span>Soon Available ({soonAvailableSpots.length})</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 bg-red-500 rounded-full mr-1"></div>
          <span>Unavailable ({unavailableSpots.length})</span>
        </div>
      </div>
    </div>
  );
};

export default ParkingMap;
