
import { useState, useEffect } from "react";
import ParkingMap from "@/components/ParkingMap";
import ParkingFilters from "@/components/ParkingFilters";
import ParkingSpotList from "@/components/ParkingSpotList";
import { useParkingSpots } from "@/hooks/useParkingSpots";
import { Button } from "@/components/ui/button";
import { Navigation, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

const ParkingDashboard = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const {
    spots,
    loading,
    filters,
    setFilters,
    selectedSpot,
    setSelectedSpot,
    resetFilters
  } = useParkingSpots(userLocation);
  
  // Get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsLoadingLocation(false);
        
        toast({
          title: "Location updated",
          description: "We've found your current location",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoadingLocation(false);
        
        toast({
          title: "Location error",
          description: error.message || "Unable to retrieve your location",
          variant: "destructive"
        });
        
        // Use default Mumbai location
        setUserLocation({
          latitude: 19.076,
          longitude: 72.8777
        });
      }
    );
  };
  
  // Get location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Smart Parking Mumbai</h1>
        <p className="text-muted-foreground mt-1">
          Find available parking spots in Mumbai in real-time
        </p>
      </header>
      
      {loading ? (
        <div className="space-y-4 py-12">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-medium">Finding parking spots near you...</h3>
            <p className="text-muted-foreground mt-2">
              We're searching for available spots in your area
            </p>
          </div>
          <Progress value={65} className="w-full max-w-md mx-auto" />
        </div>
      ) : (
        <>
          <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Your Location</h2>
                <p className="text-sm text-muted-foreground">
                  {userLocation 
                    ? "Using your current location in Mumbai" 
                    : "Location access denied. Using Mumbai city center."}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={getUserLocation}
                disabled={isLoadingLocation}
                className="gap-1"
              >
                <Navigation className="h-4 w-4" />
                <span>
                  {isLoadingLocation ? "Locating..." : "Update Location"}
                </span>
              </Button>
            </div>
            
            <ParkingFilters 
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={resetFilters}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ParkingMap 
                spots={spots}
                selectedSpot={selectedSpot}
                onSelectSpot={setSelectedSpot}
                userLocation={userLocation}
              />
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    Note: This is a simplified map for demonstration. Real implementation would use Google Maps, Mapbox, or similar.
                  </span>
                </p>
              </div>
            </div>
            
            <div>
              <ParkingSpotList 
                spots={spots}
                selectedSpot={selectedSpot}
                onSelectSpot={setSelectedSpot}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParkingDashboard;
