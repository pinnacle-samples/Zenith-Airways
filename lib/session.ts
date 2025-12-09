import { Passenger, PassengerFlight } from './types';
import { defaultPassenger, defaultPassengerFlights } from './data';

interface UserSession {
  passenger: Passenger;
  passengerFlights: PassengerFlight[];
  flightNumbers: string[];
  notificationsEnabled: boolean;
  currentBids: Map<string, number>; // flightNumber_upgradeClass -> current bid amount
  createdAt: number;
}

class SessionManager {
  private sessions: Map<string, UserSession> = new Map();
  private readonly SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

  constructor() {
    // Run cleanup every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  // Get or create session for a user
  getSession(phoneNumber: string): UserSession {
    // Check if session exists and is not expired
    const existingSession = this.sessions.get(phoneNumber);

    if (existingSession) {
      const now = Date.now();
      if (now - existingSession.createdAt < this.SESSION_DURATION) {
        return existingSession;
      } else {
        // Session expired, delete it
        this.sessions.delete(phoneNumber);
      }
    }

    // Create new session with cloned default data
    const newSession: UserSession = {
      passenger: { ...defaultPassenger },
      passengerFlights: defaultPassengerFlights.map((pf) => ({ ...pf })),
      flightNumbers: [...defaultPassenger.flightNumbers],
      notificationsEnabled: false,
      currentBids: new Map(),
      createdAt: Date.now(),
    };

    this.sessions.set(phoneNumber, newSession);
    return newSession;
  }

  // Update session data
  updateSession(phoneNumber: string, updates: Partial<Omit<UserSession, 'createdAt'>>): void {
    const session = this.getSession(phoneNumber);
    Object.assign(session, updates);
    this.sessions.set(phoneNumber, session);
  }

  // Remove a flight from user's session
  removeFlight(phoneNumber: string, flightNumber: string): void {
    const session = this.getSession(phoneNumber);
    session.flightNumbers = session.flightNumbers.filter((fn) => fn !== flightNumber);
    session.passengerFlights = session.passengerFlights.filter(
      (pf) => pf.flightNumber !== flightNumber,
    );
    this.sessions.set(phoneNumber, session);
  }

  // Enable notifications for user
  enableNotifications(phoneNumber: string): void {
    const session = this.getSession(phoneNumber);
    session.notificationsEnabled = true;
    this.sessions.set(phoneNumber, session);
  }

  // Get passenger flight details
  getPassengerFlight(phoneNumber: string, flightNumber: string): PassengerFlight | undefined {
    const session = this.getSession(phoneNumber);
    return session.passengerFlights.find((pf) => pf.flightNumber === flightNumber);
  }

  // Update bid for a flight upgrade
  updateBid(
    phoneNumber: string,
    flightNumber: string,
    upgradeClass: string,
    bidAmount: number,
  ): void {
    const session = this.getSession(phoneNumber);
    const key = `${flightNumber}_${upgradeClass}`;
    session.currentBids.set(key, bidAmount);
  }

  // Get current bid for a flight upgrade
  getCurrentBid(
    phoneNumber: string,
    flightNumber: string,
    upgradeClass: string,
  ): number | undefined {
    const session = this.getSession(phoneNumber);
    const key = `${flightNumber}_${upgradeClass}`;
    return session.currentBids.get(key);
  }

  // Reset user session (delete and recreate)
  resetSession(phoneNumber: string): void {
    this.sessions.delete(phoneNumber);
  }

  // Cleanup expired sessions
  private cleanup(): void {
    const now = Date.now();

    for (const [phoneNumber, session] of this.sessions.entries()) {
      if (now - session.createdAt >= this.SESSION_DURATION) {
        this.sessions.delete(phoneNumber);
      }
    }
  }

  // Get session stats (for debugging)
  getStats(): { totalSessions: number; activeSessions: number } {
    return {
      totalSessions: this.sessions.size,
      activeSessions: this.sessions.size,
    };
  }
}

export const sessionManager = new SessionManager();
