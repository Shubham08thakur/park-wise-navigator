
export type ParkingSpot = {
  id: string;
  latitude: number;
  longitude: number;
  available: boolean;
  price: number | null;
  timeLimit: number | null; // in minutes
  prediction: {
    willBeAvailable: boolean;
    inMinutes: number | null;
  };
  lastUpdated: string;
  address: string;
  distance?: number;
};

export type ParkingFilter = {
  maxPrice: number | null;
  minTimeLimit: number | null;
  maxDistance: number | null;
  showOnlyAvailable: boolean;
  includePredicted: boolean;
};
