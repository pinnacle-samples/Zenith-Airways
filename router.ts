import { Router, Request, Response } from 'express';
import { rcsClient } from './lib/rcsClient';
import { agent } from './lib/agent';
import { sessionManager } from './lib/session';
import { sendTypingIndicator } from './lib/typing';


interface TriggerPayload {
  action: string;
  params?: Record<string, unknown>;
}

const flyEasyRouter = Router();

flyEasyRouter.post('/', async (req: Request, res: Response) => {
  try {
    const messageEvent = await rcsClient.messages.process(req);
    if (messageEvent.type !== 'MESSAGE.RECEIVED') {
      console.error('[Zenith Airways]: User event received', messageEvent);
      return res.status(200).json({ message: 'User event received' });
    }
    const message = messageEvent.message;
    const from = messageEvent.conversation.from;

    // only handle trigger responses
    if (
      message.type === 'RCS_BUTTON_DATA' &&
      typeof message.button.raw === 'object' &&
      message.button.raw.type == 'trigger'
    ) {
      sendTypingIndicator(from);
      const payload: TriggerPayload = JSON.parse(message.button.raw.payload);

      // Clear pending bid when user presses any button (except startBidding)
      if (payload.action !== 'startBidding' && agent.hasPendingBid(from)) {
        agent.clearPendingBid(from);
      }

      switch (payload.action) {
        case 'showMainMenu':
          await agent.showMainMenu(from);
          return res.status(200).json({ message: 'Main menu sent' });

        case 'viewMyFlights':
          await agent.viewMyFlights(from);
          return res.status(200).json({ message: 'My flights sent' });

        case 'viewCancelFlights':
          await agent.viewCancelFlights(from);
          return res.status(200).json({ message: 'Cancel flights sent' });

        case 'checkFlightStatus':
          if (payload.params && 'flightNumber' in payload.params) {
            await agent.checkFlightStatus(from, payload.params.flightNumber as string);
            return res.status(200).json({ message: 'Flight status sent' });
          }
          console.error('[Zenith Airways]: Invalid trigger payload', payload);
          return res.status(400).json({
            error: 'Invalid Trigger Payload',
            received: message.button.payload ?? '',
          });

        case 'cancelFlight':
          if (payload.params && 'flightNumber' in payload.params) {
            await agent.cancelFlight(from, payload.params.flightNumber as string);
            return res.status(200).json({ message: 'Cancel flight sent' });
          }
          console.error('[Zenith Airways]: Invalid trigger payload', payload);
          return res.status(400).json({
            error: 'Invalid Trigger Payload',
            received: message.button.payload ?? '',
          });

        case 'confirmCancelFlight':
          if (payload.params && 'flightNumber' in payload.params) {
            await agent.confirmCancelFlight(from, payload.params.flightNumber as string);
            return res.status(200).json({ message: 'Confirm cancel flight sent' });
          }
          console.error('[Zenith Airways]: Invalid trigger payload', payload);
          return res.status(400).json({
            error: 'Invalid Trigger Payload',
            received: message.button.payload ?? '',
          });

        case 'enableNotifications':
          if (payload.params && 'flightNumber' in payload.params) {
            await agent.enableNotifications(from, payload.params.flightNumber as string);
            return res.status(200).json({ message: 'Notifications enabled' });
          }
          console.error('[Zenith Airways]: Invalid trigger payload', payload);
          return res.status(400).json({
            error: 'Invalid Trigger Payload',
            received: message.button.payload ?? '',
          });

        case 'viewUpgrades':
          if (payload.params && 'flightNumber' in payload.params) {
            await agent.viewUpgrades(from, payload.params.flightNumber as string);
            return res.status(200).json({ message: 'Upgrades sent' });
          }
          console.error('[Zenith Airways]: Invalid trigger payload', payload);
          return res.status(400).json({
            error: 'Invalid Trigger Payload',
            received: message.button.payload ?? '',
          });

        case 'startBidding':
          if (
            payload.params &&
            'flightNumber' in payload.params &&
            'upgradeClass' in payload.params &&
            'minimumBid' in payload.params
          ) {
            await agent.startBidding(
              from,
              payload.params.flightNumber as string,
              payload.params.upgradeClass as string,
              payload.params.minimumBid as number,
            );
            return res.status(200).json({ message: 'Bidding started' });
          }
          console.error('[Zenith Airways]: Invalid trigger payload', payload);
          return res.status(400).json({
            error: 'Invalid Trigger Payload',
            received: message.button.payload ?? '',
          });

        case 'getBoardingPass':
          await agent.getBoardingPass(from);
          return res.status(200).json({ message: 'Boarding pass sent' });

        case 'noThanks':
          await agent.noThanks(from);
          return res.status(200).json({ message: 'No thanks sent' });

        default:
          console.error('[Zenith Airways]: Invalid trigger payload', payload);
          return res.status(400).json({
            error: 'Invalid Trigger Payload',
            received: message.button.payload ?? '',
          });
      }
    }

    // Handle text messages
    if (message.type === 'RCS_TEXT') {
      sendTypingIndicator(from);
      const text = message.text.trim();

      if (text === 'MENU' || text === 'START' || text === 'SUBSCRIBE') {
        sessionManager.resetSession(from);
        agent.clearPendingBid(from); // Clear any pending bid state
        await agent.showMainMenu(from);
        return res.status(200).json({ message: 'Main menu sent with fresh session' });
      }

      // Check if user has a pending bid
      if (!agent.hasPendingBid(from)) {
        // User sent text but isn't in bidding mode - notify them
        await agent.sendStrictFormatMessage(
          from,
          'Text input is only accepted when placing a bid for flight upgrades.\n\nPlease use the buttons to interact with Zenith Airways.',
        );
        return res.status(200).json({
          message: 'Text message outside bidding context, sent notice to user.',
        });
      }

      await agent.handleTextInput(from, message.text);
      return res.status(200).json({ message: 'Text handled' });
    }

    return res.status(200).json({
      message: 'Nontrigger Event, skipping',
      received: message,
    });
  } catch (error) {
    console.error('[Zenith Airways]: Internal server error', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default flyEasyRouter;
