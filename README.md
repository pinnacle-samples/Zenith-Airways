# FlyEasy - Flight and Travel Assistant

A comprehensive flight management RCS chatbot that provides travelers with an interactive way to manage their flights, get boarding passes, upgrade seats, and receive notifications through Rich Communication Services (RCS) messaging.


https://github.com/user-attachments/assets/3f9f18c5-8181-4429-bbce-32d44a9e4639


## Features

### Flight Management

- View all upcoming flights with detailed information
- Flight number, origin, destination, departure time, gate, and status
- Real-time flight status updates with delay information
- Enable notifications for flight status changes

### Boarding Passes

- Digital boarding pass with QR code
- Seat information and boarding group details
- Quick access to gate number and boarding time

### Flight Upgrades

- Upgrade bidding system for Premium Economy, Business Class, or First Class
- Interactive text-based bid entry with validation
- Compare different upgrade classes with pricing and amenities
- Track current bids across flights and upgrade classes

### Flight Cancellations

- Easy cancellation with confirmation prompts
- Automatic refund processing with timeline information

## Project Structure

```
Flight-and-Travel-Assistant/
├── lib/
│   ├── types.ts              # Shared TypeScript interfaces
│   ├── rcsClient.ts          # Pinnacle RCS client configuration
│   ├── baseAgent.ts          # Base agent class with common functionality
│   ├── agent.ts              # FlyEasy agent implementation
│   ├── data.ts               # Mock flight data and configurations
│   └── session.ts            # Session management for user state
├── server.ts                 # Main Express server
├── router.ts                 # Express router for webhook handling
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
├── .env.example              # Environment variables template
└── .gitignore                # Git ignore rules
```

## Setup

### Prerequisites

- Node.js 18+
- A Pinnacle API account
- RCS agent configured in Pinnacle

### Installation

1. Clone the repository

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
PINNACLE_AGENT_ID=your_agent_id_here
PINNACLE_SIGNING_SECRET=your_signing_secret_here
TEST_MODE=false
PORT=3000
IMAGE_FLYEASY_ICON=your_icon_url
IMAGE_BOARDING_PASS_QR=your_qr_url
IMAGE_AMERICAN_AIRLINES_LOGO=your_logo_url
IMAGE_DELTA_AIRLINES_LOGO=your_logo_url
IMAGE_UNITED_AIRLINES_LOGO=your_logo_url
IMAGE_PREMIUM_ECONOMY_SEAT=your_image_url
```

5. Set up a public HTTPS URL for your webhook. For local development, you can use a tunneling service like [ngrok](https://ngrok.com):

   ```bash
   ngrok http 3000
   ```

   For production, deploy to your preferred hosting provider.

6. Connect your webhook to your RCS agent:

   - Go to the [Pinnacle Webhooks Dashboard](https://app.pinnacle.sh/dashboard/development/webhooks)
   - Add your public URL with the `/webhook` path (e.g., `https://your-domain.com/webhook`)
   - Select your RCS agent to receive messages at this endpoint
   - Copy the signing secret and add it to your `.env` file as `PINNACLE_SIGNING_SECRET`. The `process()` method uses this environment variable to verify the request signature.

7. Text "MENU", "START", or "SUBSCRIBE" to the bot to see the main menu.

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

| Variable                       | Description                                                            | Required            |
| ------------------------------ | ---------------------------------------------------------------------- | ------------------- |
| `PINNACLE_API_KEY`             | Your Pinnacle API key                                                  | Yes                 |
| `PINNACLE_AGENT_ID`            | Your RCS agent ID from Pinnacle Dashboard                              | Yes                 |
| `PINNACLE_SIGNING_SECRET`      | Webhook signing secret for verification                                | Yes                 |
| `TEST_MODE`                    | Set to `true` for sending with a test RCS agent to whitelisted numbers | No (default: false) |
| `PORT`                         | Server port                                                            | No (default: 3000)  |
| `IMAGE_FLYEASY_ICON`           | Main app icon URL                                                      | No                  |
| `IMAGE_BOARDING_PASS_QR`       | QR code for boarding passes                                            | No                  |
| `IMAGE_AMERICAN_AIRLINES_LOGO` | American Airlines logo URL                                             | No                  |
| `IMAGE_DELTA_AIRLINES_LOGO`    | Delta Airlines logo URL                                                | No                  |
| `IMAGE_UNITED_AIRLINES_LOGO`   | United Airlines logo URL                                               | No                  |
| `IMAGE_PREMIUM_ECONOMY_SEAT`   | Premium economy cabin image URL                                        | No                  |

## Conversation Flows

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

## Technologies

- **TypeScript**: Type-safe development
- **Express**: Web framework for webhook handling
- **rcs-js**: Pinnacle RCS SDK v2.0.6+
- **tsx**: TypeScript execution and hot-reload

## Support

For issues related to:

- RCS functionality: Contact Pinnacle support
- Chatbot implementation: Refer to the code documentation
- Configuration: Check the `.env.example` file

## Resources

- **Dashboard**: Visit [Pinnacle Dashboard](https://app.pinnacle.sh)
- **Documentation**: Visit [Pinnacle Documentation](https://docs.pinnacle.sh)
- **Support**: Email [founders@trypinnacle.app](mailto:founders@trypinnacle.app)
