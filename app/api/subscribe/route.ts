import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Subscriber {
  email: string;
  pair?: string;
  subscribedAt: string;
  ip?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

// In-memory fallback cache for serverless environments
let memorySubscribers: Subscriber[] = [];

function getSubscribers(): Subscriber[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const raw = fs.readFileSync(SUBSCRIBERS_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        memorySubscribers = parsed;
        return parsed;
      }
    }
  } catch {
    // Return memory fallback
  }
  return memorySubscribers;
}

function saveSubscribers(list: Subscriber[]): void {
  memorySubscribers = list;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write to subscribers file, cached in memory:", err);
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, pair } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = getSubscribers();

    const isDuplicate = existing.some((sub) => sub.email.toLowerCase() === cleanEmail);
    if (isDuplicate) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to MacroPulse Wire intelligence.",
        isExisting: true,
      });
    }

    const newSubscriber: Subscriber = {
      email: cleanEmail,
      pair: pair || "ALL",
      subscribedAt: new Date().toISOString(),
    };

    const updated = [newSubscriber, ...existing];
    saveSubscribers(updated);

    return NextResponse.json({
      success: true,
      message: "Subscription confirmed. You will receive institutional pre-market briefings.",
      totalSubscribers: updated.length,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const subscribers = getSubscribers();
  return NextResponse.json({
    success: true,
    count: subscribers.length,
    subscribers: subscribers.map((s) => ({
      email: s.email,
      subscribedAt: s.subscribedAt,
      pair: s.pair,
    })),
  });
}
