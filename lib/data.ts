// Mock data for Zenith Airways demo
import { Flight, Passenger, PassengerFlight, UpgradeOption } from './types';

// Helper function to format dates
const getFlightDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Sample flights
export const flights: Map<string, Flight> = new Map([
  [
    'ZN245',
    {
      flightNumber: 'ZN245',
      airline: 'Zenith Airways',
      origin: 'SFO',
      destination: 'JFK',
      departureDate: getFlightDate(0),
      departureTime: '4:45 PM',
      boardingTime: '4:25 PM',
      gate: 'B12',
      status: 'delayed',
      delayMinutes: 60,
      logo: 'https://server.trypinnacle.app/storage/v1/object/public/pinnacle-public-assets/ARC/zenith-airways/logo.png',
      supportPhone: '+18002219750',
    },
  ],
  [
    'ZN512',
    {
      flightNumber: 'ZN512',
      airline: 'Zenith Airways',
      origin: 'JFK',
      destination: 'MIA',
      departureDate: getFlightDate(7),
      departureTime: '11:30 AM',
      boardingTime: '11:00 AM',
      gate: 'C8',
      status: 'on-time',
      logo: 'https://server.trypinnacle.app/storage/v1/object/public/pinnacle-public-assets/ARC/zenith-airways/logo.png',
      supportPhone: '+18002211212',
    },
  ],
  [
    'ZN789',
    {
      flightNumber: 'ZN789',
      airline: 'Zenith Airways',
      origin: 'MIA',
      destination: 'SFO',
      departureDate: getFlightDate(14),
      departureTime: '9:15 AM',
      boardingTime: '8:45 AM',
      gate: 'A22',
      status: 'on-time',
      logo: 'https://server.trypinnacle.app/storage/v1/object/public/pinnacle-public-assets/ARC/zenith-airways/logo.png',
      supportPhone: '+18008648331',
    },
  ],
]);

// Default passenger data for demo (same for all users)
export const defaultPassenger: Passenger = {
  firstName: 'Alex',
  lastName: 'Johnson',
  bookingReference: 'ABC123',
  flightNumbers: ['ZN245', 'ZN512', 'ZN789'],
  notificationsEnabled: false,
};

// Default passenger flight details for demo
export const defaultPassengerFlights: PassengerFlight[] = [
  {
    flightNumber: 'ZN245',
    seat: '12A',
    boardingGroup: 3,
  },
  {
    flightNumber: 'ZN512',
    seat: '8C',
    boardingGroup: 2,
  },
  {
    flightNumber: 'ZN789',
    seat: '15F',
    boardingGroup: 4,
  },
];

// Upgrade options per flight
export const flightUpgradeOptions: Map<string, UpgradeOption[]> = new Map([
  [
    'ZN245',
    [
      {
        class: 'Premium Economy',
        minimumBid: 45,
        emoji: '✈️',
        description: 'Extra legroom, priority boarding, complimentary drinks',
        image:
          'https://server.trypinnacle.app/storage/v1/object/public/pinnacle-public-assets/ARC/zenith-airways/cabin-premium-economy.png',
      },
      {
        class: 'Business Class',
        minimumBid: 110,
        emoji: '🥂',
        description: 'Lie-flat seats, premium dining, lounge access',
        image:
          'https://server.trypinnacle.app/storage/v1/object/public/pinnacle-public-assets/ARC/zenith-airways/cabin-business-first.png',
      },
    ],
  ],
  [
    'ZN512',
    [
      {
        class: 'Premium Economy',
        minimumBid: 50,
        emoji: '✈️',
        description: 'Extra legroom, priority boarding, complimentary snacks',
        image:
          'https://server.trypinnacle.app/storage/v1/object/public/pinnacle-public-assets/ARC/zenith-airways/cabin-premium-economy.png',
      },
      {
        class: 'First Class',
        minimumBid: 150,
        emoji: '👑',
        description: 'Full lie-flat seats, gourmet dining, premium lounge',
        image:
          'https://server.trypinnacle.app/storage/v1/object/public/pinnacle-public-assets/ARC/zenith-airways/cabin-business-first.png',
      },
    ],
  ],
  [
    'ZN789',
    [
      {
        class: 'Premium Economy',
        minimumBid: 40,
        emoji: '✈️',
        description: 'Extra legroom, priority boarding, complimentary drinks',
        image:
          'https://server.trypinnacle.app/storage/v1/object/public/pinnacle-public-assets/ARC/zenith-airways/cabin-premium-economy.png',
      },
      {
        class: 'Business Class',
        minimumBid: 95,
        emoji: '🥂',
        description: 'Lie-flat seats, premium dining, lounge access',
        image:
          'https://server.trypinnacle.app/storage/v1/object/public/pinnacle-public-assets/ARC/zenith-airways/cabin-business-first.png',
      },
    ],
  ],
]);

// Agent info
export const agentInfo = {
  name: 'Zenith Airways',
  emoji: '✈️',
  description: 'Your personal flight assistant',
  supportPhone: '+18005551234',
};
