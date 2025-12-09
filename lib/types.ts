// Type definitions for FlyEasy agent

import { Request } from 'express';
import { Pinnacle } from 'rcs-js';

export interface TriggerPayload {
  action: string;
  params?: Record<string, unknown>;
}

export interface RequestWithMessageEvent extends Request {
  messageEvent: Pinnacle.MessageEvent;
}

export interface Flight {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  boardingTime: string;
  gate: string;
  status: 'on-time' | 'delayed' | 'boarding' | 'departed';
  delayMinutes?: number;
  logo: string;
  supportPhone: string;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  bookingReference: string;
  flightNumbers: string[];
  notificationsEnabled: boolean;
}

export interface PassengerFlight {
  flightNumber: string;
  seat: string;
  boardingGroup: number;
}

export interface UpgradeOption {
  class: 'Premium Economy' | 'Business Class' | 'First Class';
  minimumBid: number;
  emoji: string;
  description: string;
  image: string;
}

export interface UpgradeBid {
  passenger: string;
  flightNumber: string;
  upgradeClass: string;
  bidAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
}
