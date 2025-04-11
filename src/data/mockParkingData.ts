
import { ParkingSpot } from "@/types/parking";

// Central location (Mumbai city center coordinates)
const CENTER_LATITUDE = 19.076;
const CENTER_LONGITUDE = 72.8777;

// Generate random coordinates within a certain range of the center
const generateRandomCoordinate = (center: number, range: number) => {
  return center + (Math.random() - 0.5) * range;
};

// Generate a mock dataset of parking spots
export const generateMockParkingSpots = (count: number): ParkingSpot[] => {
  const spots: ParkingSpot[] = [];
  
  // Indian street names for random generation
  const streetNames = ['M.G. Road', 'S.V. Road', 'Linking Road', 'Hill Road', 'J.P. Road', 'Juhu Road'];
  const streetTypes = ['', 'Lane', 'Marg', 'Nagar', 'Colony'];
  const areas = ['Andheri', 'Bandra', 'Juhu', 'Worli', 'Colaba', 'Dadar'];
  
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
      price: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 20 : null, // Price in rupees
      timeLimit: Math.random() > 0.3 ? Math.floor(Math.random() * 120) + 30 : null,
      prediction: {
        willBeAvailable,
        inMinutes: willBeAvailable ? Math.floor(Math.random() * 30) + 5 : null
      },
      lastUpdated: new Date().toISOString(),
      address: `${Math.floor(Math.random() * 200) + 1}, ${streetNames[Math.floor(Math.random() * streetNames.length)]}, ${areas[Math.floor(Math.random() * areas.length)]}, ${streetTypes[Math.floor(Math.random() * streetTypes.length)]}`
    });
  }
  
  return spots;
};

// Export 50 mock parking spots
export const mockParkingSpots = generateMockParkingSpots(50);
