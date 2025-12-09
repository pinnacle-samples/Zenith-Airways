# FlyEasy - Flight and Travel Assistant

A comprehensive flight management chatbot powered by Pinnacle RCS that provides travelers with an interactive way to manage their flights, get boarding passes, upgrade seats, and receive real-time notifications.

## Features

### Flight Management
- **View My Flights**: Display all upcoming flights with detailed information including flight number, origin, destination, departure time, gate, and status
- **Flight Status Updates**: Check real-time flight status with delay information
- **Notifications**: Enable real-time notifications for flight status changes

### Boarding Passes
- **Digital Boarding Pass**: Get instant access to your boarding pass with QR code
- **Seat Information**: View assigned seat and boarding group details
- **Gate and Boarding Time**: Quick access to gate number and boarding time

### Flight Upgrades
- **Upgrade Bidding System**: Place bids for Premium Economy, Business Class, or First Class upgrades
- **Interactive Bidding**: Text-based bid entry with validation
- **Multiple Upgrade Options**: Compare different upgrade classes with pricing and amenities
- **Bid Tracking**: Track your current bids across different flights and upgrade classes

### Flight Cancellations
- **Easy Cancellation**: Cancel flights with confirmation prompts
- **Refund Information**: Automatic refund processing with timeline information

## Project Structure

```
Flight and Travel Assistant/
├── lib/
│   ├── shared/
│   │   ├── types.ts           # Shared TypeScript interfaces
│   │   ├── rcsClient.ts       # Pinnacle RCS client configuration
│   │   └── baseAgent.ts       # Base agent class with common functionality
│   ├── agent.ts               # Main FlyEasy agent implementation
│   ├── data.ts                # Mock flight data and configurations
│   ├── types.ts               # Agent-specific type definitions
│   └── session.ts             # Session management for user state
├── router.ts                  # Express router for webhook handling
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
└── .prettierrc                # Code formatting rules
```

## Setup

### Prerequisites
- Node.js (v18 or higher)
- A Pinnacle API account with RCS enabled
- ngrok or similar tool for webhook development

### Installation

1. Clone the repository and navigate to the project directory:
```bash
cd "Flight and Travel Assistant"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
PINNACLE_API_KEY=your_api_key_here
PINNACLE_AGENT_NAME=your_agent_name_here
TEST_MODE=true
```

5. Update the image URLs in `.env` with your own hosted images or use the provided defaults

### Running the Application

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Build TypeScript:
```bash
npm run build
```

Type checking:
```bash
npm run type-check
```

## Configuration

### Environment Variables

- `PINNACLE_API_KEY`: Your Pinnacle API key (required)
- `PINNACLE_AGENT_NAME`: Your RCS agent name (required)
- `TEST_MODE`: Set to `true` for testing, `false` for production
- `IMAGE_*`: URLs for various images used in the chatbot (logos, icons, QR codes, etc.)

### Image Assets

The following images are used throughout the chatbot:
- `IMAGE_FLYEASY_ICON`: Main app icon
- `IMAGE_BOARDING_PASS_QR`: QR code for boarding passes
- `IMAGE_AMERICAN_AIRLINES_LOGO`: American Airlines logo
- `IMAGE_DELTA_AIRLINES_LOGO`: Delta Airlines logo
- `IMAGE_UNITED_AIRLINES_LOGO`: United Airlines logo
- `IMAGE_PREMIUM_ECONOMY_SEAT`: Premium economy cabin image
- `IMAGE_BUSINESS_CLASS_DINING`: Business/First class dining image

## Usage

### User Interactions

Users can interact with the chatbot using:
- **Buttons**: Quick reply buttons for common actions
- **Text Input**: Text messages for bid amounts during upgrade process
- **Triggers**: Action-based triggers for navigation and operations

### Main Menu Commands

- Send `MENU`, `START`, or `SUBSCRIBE` to access the main menu
- Use quick reply buttons to navigate through features

### Conversation Flows

1. **View Flights**: Main Menu → My Flights → Select Flight → View Options
2. **Get Boarding Pass**: Main Menu → Get Boarding Pass → View QR Code
3. **Upgrade Seat**: My Flights → Select Flight → Upgrade Options → Place Bid
4. **Cancel Flight**: Main Menu → Cancel Flights → Select Flight → Confirm

## Technical Details

### Session Management

- Sessions are automatically created for new users
- Session data includes flights, bids, and notification preferences
- Sessions expire after 1 hour of inactivity
- Automatic cleanup of expired sessions

### Bid System

- Users can place bids for seat upgrades
- Minimum bid amounts are enforced per upgrade class
- Bid tracking across multiple flights and classes
- Text input validation for bid amounts

### Message Types

The chatbot handles:
- RCS Text messages
- RCS Button interactions
- Trigger payloads with action routing
- Media messages (images, QR codes)

## Development

### Adding New Features

1. Define new action types in `lib/shared/types.ts`
2. Add handler methods in `lib/agent.ts`
3. Update router cases in `router.ts`
4. Add mock data in `lib/data.ts` if needed

### Testing

Set `TEST_MODE=true` in your `.env` file to enable test mode, which allows testing without sending real messages.

## License

ISC
