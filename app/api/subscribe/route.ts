import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Subscriber {
  email: string;
  pair?: string;
  subscribedAt: string;
}

// In-memory global store to guarantee persistence during lambda lifecycle
const globalSubscribers: Subscriber[] = [];

function getStoragePath(): string {
  // If running in Vercel or production serverless, write to writable /tmp
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return path.join("/tmp", "subscribers.json");
  }
  return path.join(process.cwd(), "data", "subscribers.json");
}

function loadSubscribers(): Subscriber[] {
  try {
    const filePath = getStoragePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Return memory fallback
  }
  return globalSubscribers;
}

function persistSubscribers(list: Subscriber[]): void {
  // Update memory store
  globalSubscribers.length = 0;
  globalSubscribers.push(...list);

  try {
    const filePath = getStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
  } catch {
    // Memory cache remains active if filesystem is restricted
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    let body: { email?: string; pair?: string } = {};
    try {
      const rawText = await request.text();
      try {
        body = JSON.parse(rawText);
      } catch {
        // Fallback for form-encoded or query params
        const params = new URLSearchParams(rawText);
        body = {
          email: params.get("email") || undefined,
          pair: params.get("pair") || undefined,
        };
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { email, pair } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const currentList = loadSubscribers();

    const isDuplicate = currentList.some((s) => s.email.toLowerCase() === cleanEmail);
    if (isDuplicate) {
      return NextResponse.json({
        success: true,
        message: "You are already registered for MacroPulse institutional intelligence.",
        isExisting: true,
      });
    }

    const newSubscriber: Subscriber = {
      email: cleanEmail,
      pair: pair || "ALL",
      subscribedAt: new Date().toISOString(),
    };

    const updated = [newSubscriber, ...currentList];
    persistSubscribers(updated);

    return NextResponse.json({
      success: true,
      message: "Subscription confirmed. You will receive pre-market macro briefings.",
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
  const subscribers = loadSubscribers();
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
