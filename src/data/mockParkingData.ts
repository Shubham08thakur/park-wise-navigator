
import { ParkingSpot } from "@/types/parking";

// Central location (city center coordinates)
const CENTER_LATITUDE = 40.7128;
const CENTER_LONGITUDE = -74.0060;

// Generate random coordinates within a certain range of the center
const generateRandomCoordinate = (center: number, range: number) => {
  return center + (Math.random() - 0.5) * range;
};

// Generate a mock dataset of parking spots
export const generateMockParkingSpots = (count: number): ParkingSpot[] => {
  const spots: ParkingSpot[] = [];
  
  for (let i = 0; i < count; i++) {
    const latitude = generateRandomCoordinate(CENTER_LATITUDE, 0.02);
    const longitude = generateRandomCoordinate(CENTER_LONGITUDE, 0.02);
    const available = Math.random() > 0.4; // 60% chance of being available
    const willBeAvailable = !available && Math.random() > 0.5;
    
    spots.push({
      id: `spot-${i}`,
      latitude,
      longitude,
      available,
      price: Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 1 : null,
      timeLimit: Math.random() > 0.3 ? Math.floor(Math.random() * 120) + 30 : null,
      prediction: {
        willBeAvailable,
        inMinutes: willBeAvailable ? Math.floor(Math.random() * 30) + 5 : null
      },
      lastUpdated: new Date().toISOString(),
      address: `${Math.floor(Math.random() * 200) + 1} ${['Main', 'Park', 'Broadway', 'Oak', 'Maple', 'Cedar'][Math.floor(Math.random() * 6)]} ${['St', 'Ave', 'Blvd', 'Rd'][Math.floor(Math.random() * 4)]}`
    });
  }
  
  return spots;
};

// Export 50 mock parking spots
export const mockParkingSpots = generateMockParkingSpots(50);
