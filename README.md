# Zenith Airways — RCS Flight & Travel Assistant

A flight management chatbot that lives inside RCS. Travelers can view their flights, pull up boarding passes, request bid-style seat upgrades, check flight status, cancel flights, and opt in to proactive notifications — without ever opening an app.

> **Live guide:** https://pinnacle.sh/samples/zenith-airways

https://github.com/user-attachments/assets/3f9f18c5-8181-4429-bbce-32d44a9e4639

> Note: the visuals in this demo recording have since been refreshed with sharper brand assets. The conversation flow is identical to what you'll get from a fresh clone.

## What's inside

- View upcoming flights as a card carousel
- Boarding pass card with QR, gate, seat, and boarding time
- Bid-for-upgrade flow that takes the user from main menu to confirmation in three taps
- Flight cancellation with confirmation step
- Per-user session state for multi-step flows
- Hooks for proactive gate-change and delay alerts

## Prerequisites

- Node.js 18+
- A Pinnacle account — [sign up](https://app.pinnacle.sh/auth/sign-up)
- An RCS [test agent](https://docs.pinnacle.sh/guides/branded-test-agents) for development
- A Pinnacle [API key](https://app.pinnacle.sh/dashboard/development/api-keys) and [webhook signing secret](https://app.pinnacle.sh/dashboard/development/webhooks)

## Quick start

```bash
git clone https://github.com/pinnacle-samples/Zenith-Airways
cd Zenith-Airways
npm install
cp .env.example .env
# fill in PINNACLE_API_KEY, PINNACLE_AGENT_ID, PINNACLE_SIGNING_SECRET
npm run dev
```

Expose your webhook with [ngrok](https://ngrok.com):

```bash
ngrok http 3000
```

Then in the [Pinnacle Webhooks dashboard](https://app.pinnacle.sh/dashboard/development/webhooks):

1. Add `https://<your-tunnel-domain>/webhook`
2. Attach it to your RCS agent
3. Copy the signing secret into `PINNACLE_SIGNING_SECRET`

Send `MENU` or `START` to your agent — you'll see the Zenith Airways landing card with **My Flights**, **Get Boarding Pass**, **View Upgrades**, and **Cancel Flights**.

## Environment variables

```env
PINNACLE_API_KEY=your_pinnacle_api_key_here
PINNACLE_AGENT_ID=your_agent_id_here
PINNACLE_SIGNING_SECRET=your_signing_secret_here
TEST_MODE=false
PORT=3000
```

## Project structure

```
Zenith-Airways/
├── server.ts              # Express bootstrap
├── router.ts              # /webhook POST — verifies + dispatches
└── lib/
    ├── rcsClient.ts       # PinnacleClient instance
    ├── baseAgent.ts       # Shared send + typing helpers
    ├── typing.ts          # Fire-and-forget typing indicator
    ├── agent.ts           # ZenithAgent — every action handler
    ├── data.ts            # Flights, upgrade options, agentInfo (brand)
    ├── session.ts         # Per-user multi-step session state
    └── types.ts           # Flight, BoardingPass, UpgradeOption
```

## Action handlers

| Action | What it does |
| --- | --- |
| `showMainMenu` | Landing card with all entry points |
| `viewMyFlights` | Upcoming flights as a card carousel |
| `getBoardingPass` | Boarding pass card with QR, gate, seat |
| `checkFlightStatus` | On-time / delay status for a chosen flight |
| `viewUpgrades` / `startBidding` | Browse and bid on seat upgrades |
| `viewCancelFlights` / `cancelFlight` / `confirmCancelFlight` | Cancellation flow |
| `enableNotifications` / `noThanks` | Opt in to proactive alerts |

## Customize the airline brand

`agentInfo` in `lib/data.ts` controls the airline name, tagline, and logo. Swap those fields and the main menu rebrands automatically.

`flights` is a static array per phone number. In production you'll fan out to your reservation system on demand:

```typescript
async getFlightsByPhone(from: string): Promise<Flight[]> {
  return await reservationApi.lookupByPhone(from);
}
```

## Sessions and multi-step flows

`lib/session.ts` keeps a small `Map<string, Session>` so the agent remembers what the user was doing across messages — for example, which flight they're upgrading. Replace with Redis when you outgrow a single process.

## Going to production

- Set `TEST_MODE=false` and submit your agent for [carrier approval](https://docs.pinnacle.sh/guides/campaigns/rcs)
- Wire `getFlightsByPhone` to your real reservation system
- Add proactive notifications by calling `agent.sendMessage(from, ...)` from a cron or queue worker on gate changes / delays

## Resources

- **Live guide:** https://pinnacle.sh/samples/zenith-airways
- **Pinnacle docs:** https://docs.pinnacle.sh/documentation/introduction
- **Pinnacle dashboard:** https://app.pinnacle.sh
- **Support:** founders@trypinnacle.app
