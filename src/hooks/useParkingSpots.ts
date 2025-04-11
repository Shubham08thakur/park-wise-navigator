
import { useState, useEffect } from "react";
import { ParkingSpot, ParkingFilter } from "@/types/parking";
import { mockParkingSpots } from "@/data/mockParkingData";

const DEFAULT_FILTER: ParkingFilter = {
  maxPrice: null,
  minTimeLimit: null,
  maxDistance: null,
  showOnlyAvailable: false,
  includePredicted: true,
};

export const useParkingSpots = (userLocation?: { latitude: number; longitude: number }) => {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>([]);
  const [filters, setFilters] = useState<ParkingFilter>(DEFAULT_FILTER);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

  // Calculate distance between two coordinates in kilometers
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, this would be an API call
        // For now, we'll use our mock data
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let data = [...mockParkingSpots];
        
        // Add distance if user location is provided
        if (userLocation) {
          data = data.map(spot => ({
            ...spot,
            distance: calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              spot.latitude,
              spot.longitude
            )
          }));
        }
        
        setSpots(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching parking spots:", error);
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto refresh data every 30 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [userLocation]);

  // Apply filters whenever spots or filters change
  useEffect(() => {
    let filtered = [...spots];

    if (filters.showOnlyAvailable) {
      filtered = filtered.filter(spot => spot.available);
    }

    if (filters.maxPrice !== null) {
      filtered = filtered.filter(spot => 
        spot.price === null || spot.price <= filters.maxPrice!
      );
    }

    if (filters.minTimeLimit !== null) {
      filtered = filtered.filter(spot => 
        spot.timeLimit === null || spot.timeLimit >= filters.minTimeLimit!
      );
    }

    if (filters.maxDistance !== null && userLocation) {
      filtered = filtered.filter(spot => 
        spot.distance !== undefined && spot.distance <= filters.maxDistance!
      );
    }

    if (filters.includePredicted) {
      // Include spots that will be available soon
      const unavailableButPredicted = spots.filter(
        spot => !spot.available && spot.prediction.willBeAvailable
      );
      
      // Make sure these aren't already in our filtered list
      const filteredIds = new Set(filtered.map(spot => spot.id));
      const additionalSpots = unavailableButPredicted.filter(
        spot => !filteredIds.has(spot.id)
      );
      
      filtered = [...filtered, ...additionalSpots];
    }

    // Sort by availability first, then by distance if available
    filtered.sort((a, b) => {
      if (a.available && !b.available) return -1;
      if (!a.available && b.available) return 1;
      
      // Then sort by "will be available soon"
      if (!a.available && !b.available) {
        if (a.prediction.willBeAvailable && !b.prediction.willBeAvailable) return -1;
        if (!a.prediction.willBeAvailable && b.prediction.willBeAvailable) return 1;
        
        // Then by how soon it will be available
        if (a.prediction.willBeAvailable && b.prediction.willBeAvailable) {
          return (a.prediction.inMinutes || 0) - (b.prediction.inMinutes || 0);
        }
      }
      
      // Then by distance if available
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      
      return 0;
    });

    setFilteredSpots(filtered);
  }, [spots, filters, userLocation]);

  return {
    spots: filteredSpots,
    loading,
    filters,
    setFilters,
    selectedSpot,
    setSelectedSpot,
    resetFilters: () => setFilters(DEFAULT_FILTER),
  };
};
