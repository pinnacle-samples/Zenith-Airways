import { Pinnacle } from 'rcs-js';
import { BaseAgent } from './baseAgent';
import { flights, flightUpgradeOptions, agentInfo } from './data';
import { UpgradeBid } from './types';
import { sessionManager } from './session';

export class ZenithAgent extends BaseAgent {
  private upgradeBids: Map<string, UpgradeBid> = new Map();
  private pendingBidInputs: Map<string, { flightNumber: string; upgradeClass: string }> = new Map();

  // 1. Main Menu & Entry Point
  async showMainMenu(to: string) {
    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: [
        {
          title: `${agentInfo.name} - ${agentInfo.description}.`,
          subtitle: 'Press any button to get started.',
          media:
            'https://server.trypinnacle.app/storage/v1/object/public/pinnacle-public-assets/ARC/zenith-airways/logo.png',
          buttons: [],
        },
      ],
      quickReplies: [
        {
          type: 'trigger',
          title: '✈️ My Flights',
          payload: JSON.stringify({ action: 'viewMyFlights' }),
        },
        {
          type: 'trigger',
          title: '🎟️ Get Boarding Pass',
          payload: JSON.stringify({ action: 'getBoardingPass' }),
        },
        {
          type: 'trigger',
          title: '❌ Cancel Flights',
          payload: JSON.stringify({ action: 'viewCancelFlights' }),
        },
        {
          type: 'trigger',
          title: '🔚 End Demo',
          payload: 'END_DEMO',
        },
      ],
    });
  }

  // 2. View My Flights - Show user's flights as cards
  async viewMyFlights(to: string) {
    const session = sessionManager.getSession(to);
    const flightCards = session.flightNumbers
      .map((flightNumber) => {
        const flight = flights.get(flightNumber);

        if (!flight) return null;

        const statusEmoji =
          flight.status === 'on-time' ? '✅' : flight.status === 'delayed' ? '⚠️' : '🛫';
        const statusText =
          flight.status === 'delayed'
            ? `Delayed until ${flight.departureTime}`
            : flight.status === 'on-time'
              ? 'On Time'
              : flight.status;

        return {
          title: `${statusEmoji} Flight ${flight.flightNumber}`,
          subtitle: `${flight.origin} → ${flight.destination}\n${flight.departureDate} • ${flight.departureTime}\nGate ${flight.gate} • ${statusText}`,
          media: flight.logo,
          buttons: [
            {
              type: 'trigger' as const,
              title: '📡 Check flight status',
              payload: JSON.stringify({
                action: 'checkFlightStatus',
                params: { flightNumber: flight.flightNumber },
              }),
            },
            {
              type: 'trigger' as const,
              title: '💺 Upgrade options',
              payload: JSON.stringify({
                action: 'viewUpgrades',
                params: { flightNumber: flight.flightNumber },
              }),
            },
            {
              type: 'trigger' as const,
              title: '❌ Cancel',
              payload: JSON.stringify({
                action: 'cancelFlight',
                params: { flightNumber: flight.flightNumber },
              }),
            },
          ],
        };
      })
      .filter((card) => card !== null);

    if (flightCards.length === 0) {
      return await this.client.messages.rcs.send({
        from: this.agentName,
        to: to,
        text: 'No flights found. Please contact support.',
        quickReplies: [
          {
            type: 'call',
            title: 'Call Support',
            payload: '+15125551234',
          },
          {
            type: 'trigger',
            title: '🔙 Back to main menu',
            payload: JSON.stringify({ action: 'showMainMenu' }),
          },
        ],
      });
    }

    // Get the first flight's support phone
    const firstFlight = flights.get(session.flightNumbers[0]);
    const supportPhone = firstFlight?.supportPhone || '+18005551234';

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: flightCards,
      quickReplies: [
        {
          type: 'call',
          title: 'Call Support',
          payload: supportPhone,
        },
        {
          type: 'trigger',
          title: '🔙 Back to main menu',
          payload: JSON.stringify({ action: 'showMainMenu' }),
        },
      ],
    });
  }

  // 2b. Check Flight Status (from My Flights)
  async checkFlightStatus(to: string, flightNumber: string) {
    const flight = flights.get(flightNumber);

    if (!flight) {
      return await this.client.messages.rcs.send({
        from: this.agentName,
        to: to,
        text: 'Flight not found.',
        quickReplies: [
          {
            type: 'trigger',
            title: '🔙 Back to main menu',
            payload: JSON.stringify({ action: 'showMainMenu' }),
          },
        ],
      });
    }

    const statusText =
      flight.status === 'delayed'
        ? `delayed until ${flight.departureTime}`
        : flight.status === 'on-time'
          ? 'on time'
          : flight.status;

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: `✈️ Flight ${flight.flightNumber} from ${flight.origin} → ${flight.destination} is ${statusText} and boarding starts at ${flight.boardingTime}.\n\nWant me to notify you if anything changes?`,
      quickReplies: [
        {
          type: 'trigger',
          title: '✅ Yes, keep me updated',
          payload: JSON.stringify({
            action: 'enableNotifications',
            params: { flightNumber },
          }),
        },
        {
          type: 'trigger',
          title: '❌ No, thanks',
          payload: JSON.stringify({ action: 'noThanks' }),
        },
        {
          type: 'trigger',
          title: '💺 Check upgrade options',
          payload: JSON.stringify({
            action: 'viewUpgrades',
            params: { flightNumber },
          }),
        },
      ],
    });
  }

  // 2c. Cancel Flight
  async cancelFlight(to: string, flightNumber: string) {
    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: `Are you sure you want to cancel flight ${flightNumber}? This action cannot be undone.`,
      quickReplies: [
        {
          type: 'trigger',
          title: '✅ Yes, cancel flight',
          payload: JSON.stringify({
            action: 'confirmCancelFlight',
            params: { flightNumber },
          }),
        },
        {
          type: 'trigger',
          title: '❌ No, go back',
          payload: JSON.stringify({ action: 'viewMyFlights' }),
        },
      ],
    });
  }

  // 2d. Confirm Cancel Flight
  async confirmCancelFlight(to: string, flightNumber: string) {
    // Remove flight from user's session
    sessionManager.removeFlight(to, flightNumber);

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: `✅ Flight ${flightNumber} has been canceled. You'll receive a refund within 5-7 business days.`,
      quickReplies: [
        {
          type: 'trigger',
          title: '✈️ My Flights',
          payload: JSON.stringify({ action: 'viewMyFlights' }),
        },
        {
          type: 'trigger',
          title: '🔙 Back to main menu',
          payload: JSON.stringify({ action: 'showMainMenu' }),
        },
      ],
    });
  }

  // 3. Enable Notifications
  async enableNotifications(to: string, flightNumber: string) {
    // Enable notifications in session
    sessionManager.enableNotifications(to);

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: `✅ You'll receive updates if flight ${flightNumber} status changes.`,
      quickReplies: [
        {
          type: 'trigger',
          title: '💺 View upgrade offers',
          payload: JSON.stringify({
            action: 'viewUpgrades',
            params: { flightNumber },
          }),
        },
        {
          type: 'trigger',
          title: '🎟️ Get boarding pass',
          payload: JSON.stringify({ action: 'getBoardingPass' }),
        },
        {
          type: 'trigger',
          title: '🔙 Back to main menu',
          payload: JSON.stringify({ action: 'showMainMenu' }),
        },
      ],
    });
  }

  // 4. View Upgrade Offers
  async viewUpgrades(to: string, flightNumber: string, skipIntroText: boolean = false) {
    const upgradeOptions = flightUpgradeOptions.get(flightNumber);

    if (!upgradeOptions) {
      return await this.client.messages.rcs.send({
        from: this.agentName,
        to: to,
        text: 'No upgrade options available for this flight.',
        quickReplies: [
          {
            type: 'trigger',
            title: '🔙 Go back',
            payload: JSON.stringify({ action: 'viewMyFlights' }),
          },
        ],
      });
    }

    const cards: Pinnacle.RichCards.Cards.Item[] = upgradeOptions.map((upgrade) => {
      const currentBid = sessionManager.getCurrentBid(to, flightNumber, upgrade.class);
      const bidText = currentBid ? `Current Bid: $${currentBid}` : `From $${upgrade.minimumBid}`;

      return {
        title: `${upgrade.emoji} ${upgrade.class}`,
        subtitle: `${bidText}\n${upgrade.description}`,
        media: upgrade.image,
        buttons: [
          {
            type: 'trigger',
            title: '🪙 Place Bid',
            payload: JSON.stringify({
              action: 'startBidding',
              params: {
                flightNumber,
                upgradeClass: upgrade.class,
                minimumBid: upgrade.minimumBid,
              },
            }),
          },
        ],
      };
    });

    if (!skipIntroText) {
      await this.client.messages.rcs.send({
        from: this.agentName,
        to: to,
        text: `Here are your available upgrade options for Flight ${flightNumber}:`,
        quickReplies: [
          {
            type: 'trigger',
            title: '🏠 Main Menu',
            payload: JSON.stringify({ action: 'showMainMenu' }),
          },
          {
            type: 'trigger',
            title: '🔚 End Demo',
            payload: 'END_DEMO',
          },
        ],
      });
    }

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: cards,
      quickReplies: [
        {
          type: 'trigger',
          title: '🔙 Go back',
          payload: JSON.stringify({ action: 'viewMyFlights' }),
        },
      ],
    });
  }

  // 4b. View Cancel Flights - Show flights with cancel buttons
  async viewCancelFlights(to: string) {
    const session = sessionManager.getSession(to);
    const flightCards = session.flightNumbers
      .map((flightNumber) => {
        const flight = flights.get(flightNumber);

        if (!flight) return null;

        const statusEmoji =
          flight.status === 'on-time' ? '✅' : flight.status === 'delayed' ? '⚠️' : '🛫';
        const statusText =
          flight.status === 'delayed'
            ? `Delayed until ${flight.departureTime}`
            : flight.status === 'on-time'
              ? 'On Time'
              : flight.status;

        return {
          title: `${statusEmoji} Flight ${flight.flightNumber}`,
          subtitle: `${flight.origin} → ${flight.destination}\n${flight.departureDate} • ${flight.departureTime}\nGate ${flight.gate} • ${statusText}`,
          media: flight.logo,
          buttons: [
            {
              type: 'trigger' as const,
              title: '❌ Cancel This Flight',
              payload: JSON.stringify({
                action: 'cancelFlight',
                params: { flightNumber: flight.flightNumber },
              }),
            },
          ],
        };
      })
      .filter((card) => card !== null);

    if (flightCards.length === 0) {
      return await this.client.messages.rcs.send({
        from: this.agentName,
        to: to,
        text: 'No flights found.',
        quickReplies: [
          {
            type: 'trigger',
            title: '🔙 Back to main menu',
            payload: JSON.stringify({ action: 'showMainMenu' }),
          },
        ],
      });
    }

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      cards: flightCards,
      quickReplies: [
        {
          type: 'trigger',
          title: '🔙 Back to main menu',
          payload: JSON.stringify({ action: 'showMainMenu' }),
        },
      ],
    });
  }

  // 5. Start Bidding Process
  async startBidding(to: string, flightNumber: string, upgradeClass: string, minimumBid: number) {
    // Store the pending bid context
    this.pendingBidInputs.set(to, {
      flightNumber,
      upgradeClass,
    });

    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: `Enter your bid amount for ${upgradeClass} on Flight ${flightNumber} (minimum $${minimumBid}):`,
      quickReplies: [
        {
          type: 'trigger',
          title: '❌ Cancel',
          payload: JSON.stringify({
            action: 'viewUpgrades',
            params: { flightNumber },
          }),
        },
      ],
    });
  }

  // 6. Submit Bid
  async submitBid(to: string, bidAmount: number) {
    const pendingBid = this.pendingBidInputs.get(to);

    if (!pendingBid) {
      return await this.client.messages.rcs.send({
        from: this.agentName,
        to: to,
        text: 'Something went wrong. Please try again.',
        quickReplies: [
          {
            type: 'trigger',
            title: '🔙 Back to main menu',
            payload: JSON.stringify({ action: 'showMainMenu' }),
          },
        ],
      });
    }

    // Store the bid
    const bidId = `${to}-${Date.now()}`;
    this.upgradeBids.set(bidId, {
      passenger: to,
      flightNumber: pendingBid.flightNumber,
      upgradeClass: pendingBid.upgradeClass,
      bidAmount,
      status: 'pending',
    });

    // Update current bid in session
    sessionManager.updateBid(to, pendingBid.flightNumber, pendingBid.upgradeClass, bidAmount);

    // Clear pending input
    this.pendingBidInputs.delete(to);

    // Send confirmation message
    await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: `✅ Bid of $${bidAmount} submitted for ${pendingBid.upgradeClass} on Flight ${pendingBid.flightNumber}.\n\nIf your bid is accepted, you'll pay for the upgrade at the check-in desk before departure.`,
      quickReplies: [
        {
          type: 'trigger',
          title: '🏠 Main Menu',
          payload: JSON.stringify({ action: 'showMainMenu' }),
        },
        {
          type: 'trigger',
          title: '🔚 End Demo',
          payload: 'END_DEMO',
        },
      ],
    });

    // Send upgrade cards again to show updated bid (skip intro text)
    return await this.viewUpgrades(to, pendingBid.flightNumber, true);
  }

  // 7. Get Boarding Pass
  async getBoardingPass(to: string) {
    const session = sessionManager.getSession(to);

    // Get the next flight (first in the list)
    const nextFlightNumber = session.flightNumbers[0];

    if (!nextFlightNumber) {
      return await this.client.messages.rcs.send({
        from: this.agentName,
        to: to,
        text: 'No upcoming flights found.',
        quickReplies: [
          {
            type: 'trigger',
            title: '🔙 Back to main menu',
            payload: JSON.stringify({ action: 'showMainMenu' }),
          },
        ],
      });
    }

    const flight = flights.get(nextFlightNumber);
    const passengerFlight = sessionManager.getPassengerFlight(to, nextFlightNumber);

    if (!flight || !passengerFlight) {
      return await this.client.messages.rcs.send({
        from: this.agentName,
        to: to,
        text: 'Flight not found.',
        quickReplies: [
          {
            type: 'trigger',
            title: '🏠 Main Menu',
            payload: JSON.stringify({ action: 'showMainMenu' }),
          },
          {
            type: 'trigger',
            title: '🔚 End Demo',
            payload: 'END_DEMO',
          },
        ],
      });
    }

    // Send text message with boarding pass details
    await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: `🎟️ Boarding Pass for Flight ${flight.flightNumber}\n\n${flight.origin} → ${flight.destination}\n${flight.departureDate} • ${flight.departureTime}\n\nSeat: ${passengerFlight.seat}\nBoarding Group: ${passengerFlight.boardingGroup}\nBoarding Time: ${flight.boardingTime}\nGate: ${flight.gate}`,
      quickReplies: [
        {
          type: 'trigger',
          title: '🏠 Main Menu',
          payload: JSON.stringify({ action: 'showMainMenu' }),
        },
        {
          type: 'trigger',
          title: '🔚 End Demo',
          payload: 'END_DEMO',
        },
      ],
    });

    // Send QR code as media
    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      media:
        'https://server.trypinnacle.app/storage/v1/object/public/pinnacle-public-assets/ARC/zenith-airways/boarding-pass-qr.png',
      quickReplies: [
        {
          type: 'trigger',
          title: '✈️ My Flights',
          payload: JSON.stringify({ action: 'viewMyFlights' }),
        },
        {
          type: 'trigger',
          title: '🔙 Back to main menu',
          payload: JSON.stringify({ action: 'showMainMenu' }),
        },
      ],
    });
  }

  // No thanks response
  async noThanks(to: string) {
    return await this.client.messages.rcs.send({
      from: this.agentName,
      to: to,
      text: 'No problem! What would you like to do next?',
      quickReplies: [
        {
          type: 'trigger',
          title: '✈️ My Flights',
          payload: JSON.stringify({ action: 'viewMyFlights' }),
        },
        {
          type: 'trigger',
          title: '🔙 Back to main menu',
          payload: JSON.stringify({ action: 'showMainMenu' }),
        },
      ],
    });
  }

  // Check if user has a pending bid
  hasPendingBid(to: string): boolean {
    return this.pendingBidInputs.has(to);
  }

  // Clear pending bid
  clearPendingBid(to: string): void {
    this.pendingBidInputs.delete(to);
  }

  // Handle text input (for bid amounts)
  async handleTextInput(to: string, text: string) {
    // Check if user is in the middle of bidding
    const pendingBid = this.pendingBidInputs.get(to);

    if (pendingBid) {
      // Try to parse bid amount
      const bidAmount = parseFloat(text.replace(/[$,]/g, ''));

      if (isNaN(bidAmount) || bidAmount <= 0) {
        return await this.client.messages.rcs.send({
          from: this.agentName,
          to: to,
          text: 'Please enter a valid bid amount (e.g., $60 or 60):',
          quickReplies: [
            {
              type: 'trigger',
              title: '❌ Cancel',
              payload: JSON.stringify({
                action: 'viewUpgrades',
                params: { flightNumber: pendingBid.flightNumber },
              }),
            },
          ],
        });
      }

      return await this.submitBid(to, bidAmount);
    }

    // Default response for unexpected text
    return await this.showMainMenu(to);
  }
}

export const agent = new ZenithAgent();
