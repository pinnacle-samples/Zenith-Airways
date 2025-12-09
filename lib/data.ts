// Mock data for FlyEasy demo
import { Flight, Passenger, PassengerFlight, UpgradeOption } from './types';
import 'dotenv/config';

// Image URLs from environment variables
export const IMAGES = {
  FLYEASY_ICON: process.env.IMAGE_FLYEASY_ICON || '',
  BOARDING_PASS_QR: process.env.IMAGE_BOARDING_PASS_QR || '',
  AMERICAN_AIRLINES_LOGO: process.env.IMAGE_AMERICAN_AIRLINES_LOGO || '',
  DELTA_AIRLINES_LOGO: process.env.IMAGE_DELTA_AIRLINES_LOGO || '',
  UNITED_AIRLINES_LOGO: process.env.IMAGE_UNITED_AIRLINES_LOGO || '',
  PREMIUM_ECONOMY_SEAT: process.env.IMAGE_PREMIUM_ECONOMY_SEAT || '',
  BUSINESS_CLASS_DINING: process.env.IMAGE_BUSINESS_CLASS_DINING || '',
};

// Helper function to format dates
const getFlightDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Sample flights
export const flights: Map<string, Flight> = new Map([
  [
    'AA245',
    {
      flightNumber: 'AA245',
      airline: 'American Airlines',
      origin: 'SFO',
      destination: 'JFK',
      departureDate: getFlightDate(0),
      departureTime: '4:45 PM',
      boardingTime: '4:25 PM',
      gate: 'B12',
      status: 'delayed',
      delayMinutes: 60,
      logo: IMAGES.AMERICAN_AIRLINES_LOGO,
      supportPhone: '+18002219750',
    },
  ],
  [
    'DL512',
    {
      flightNumber: 'DL512',
      airline: 'Delta Airlines',
      origin: 'JFK',
      destination: 'MIA',
      departureDate: getFlightDate(7),
      departureTime: '11:30 AM',
      boardingTime: '11:00 AM',
      gate: 'C8',
      status: 'on-time',
      logo: IMAGES.DELTA_AIRLINES_LOGO,
      supportPhone: '+18002211212',
    },
  ],
  [
    'UA789',
    {
      flightNumber: 'UA789',
      airline: 'United Airlines',
      origin: 'MIA',
      destination: 'SFO',
      departureDate: getFlightDate(14),
      departureTime: '9:15 AM',
      boardingTime: '8:45 AM',
      gate: 'A22',
      status: 'on-time',
      logo: IMAGES.UNITED_AIRLINES_LOGO,
      supportPhone: '+18008648331',
    },
  ],
]);

// Default passenger data for demo (same for all users)
export const defaultPassenger: Passenger = {
  firstName: 'Alex',
  lastName: 'Johnson',
  bookingReference: 'ABC123',
  flightNumbers: ['AA245', 'DL512', 'UA789'],
  notificationsEnabled: false,
};

// Default passenger flight details for demo
export const defaultPassengerFlights: PassengerFlight[] = [
  {
    flightNumber: 'AA245',
    seat: '12A',
    boardingGroup: 3,
  },
  {
    flightNumber: 'DL512',
    seat: '8C',
    boardingGroup: 2,
  },
  {
    flightNumber: 'UA789',
    seat: '15F',
    boardingGroup: 4,
  },
];

// Upgrade options per flight
export const flightUpgradeOptions: Map<string, UpgradeOption[]> = new Map([
  [
    'AA245',
    [
      {
        class: 'Premium Economy',
        minimumBid: 45,
        emoji: '✈️',
        description: 'Extra legroom, priority boarding, complimentary drinks',
        image: IMAGES.PREMIUM_ECONOMY_SEAT,
      },
      {
        class: 'Business Class',
        minimumBid: 110,
        emoji: '🥂',
        description: 'Lie-flat seats, premium dining, lounge access',
        image: IMAGES.BUSINESS_CLASS_DINING,
      },
    ],
  ],
  [
    'DL512',
    [
      {
        class: 'Premium Economy',
        minimumBid: 50,
        emoji: '✈️',
        description: 'Extra legroom, priority boarding, complimentary snacks',
        image: IMAGES.PREMIUM_ECONOMY_SEAT,
      },
      {
        class: 'First Class',
        minimumBid: 150,
        emoji: '👑',
        description: 'Full lie-flat seats, gourmet dining, premium lounge',
        image: IMAGES.BUSINESS_CLASS_DINING,
      },
    ],
  ],
  [
    'UA789',
    [
      {
        class: 'Premium Economy',
        minimumBid: 40,
        emoji: '✈️',
        description: 'Extra legroom, priority boarding, complimentary drinks',
        image: IMAGES.PREMIUM_ECONOMY_SEAT,
      },
      {
        class: 'Business Class',
        minimumBid: 95,
        emoji: '🥂',
        description: 'Lie-flat seats, premium dining, lounge access',
        image: IMAGES.BUSINESS_CLASS_DINING,
      },
    ],
  ],
]);

// Agent info
export const agentInfo = {
  name: 'FlyEasy',
  emoji: '✈️',
  description: 'Your personal flight assistant',
  supportPhone: '+18005551234',
};
