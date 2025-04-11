
import { ParkingSpot } from "@/types/parking";
import { Car, Clock, DollarSign, MapPin, Navigation } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ParkingSpotListProps {
  spots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  onSelectSpot: (spot: ParkingSpot) => void;
}

const ParkingSpotList = ({ 
  spots, 
  selectedSpot, 
  onSelectSpot 
}: ParkingSpotListProps) => {
  // Helper function to determine status text and color
  const getStatusInfo = (spot: ParkingSpot) => {
    if (spot.available) {
      return { text: "Available Now", className: "text-green-600 bg-green-50 border-green-200" };
    }
    if (spot.prediction.willBeAvailable) {
      return {
        text: `Available in ${spot.prediction.inMinutes}min`, 
        className: "text-yellow-600 bg-yellow-50 border-yellow-200"
      };
    }
    return { text: "Unavailable", className: "text-red-600 bg-red-50 border-red-200" };
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Nearby Parking ({spots.length})</h3>
      
      {spots.length === 0 ? (
        <div className="text-center py-8 bg-muted/50 rounded-lg">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No parking spots match your filters</p>
        </div>
      ) : (
        <ScrollArea className="h-[300px] rounded-lg border">
          <div className="p-1">
            {spots.map((spot, index) => {
              const statusInfo = getStatusInfo(spot);
              
              return (
                <div key={spot.id}>
                  <div
                    className={`p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedSpot?.id === spot.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => onSelectSpot(spot)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{spot.address}</h4>
                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          {spot.distance !== undefined && (
                            <span className="flex items-center mr-3">
                              <Navigation className="h-3 w-3 mr-1" />
                              {spot.distance.toFixed(2)}km
                            </span>
                          )}
                          
                          {spot.price !== null && (
                            <span className="flex items-center mr-3">
                              <DollarSign className="h-3 w-3 mr-1" />
                              ${spot.price}/hr
                            </span>
                          )}
                          
                          {spot.timeLimit !== null && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {spot.timeLimit}min
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <span 
                        className={`text-xs px-2 py-1 rounded-full border ${statusInfo.className}`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>
                  {index < spots.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ParkingSpotList;
