/**
 * MacroPulse Daily Wire Automation Worker
 * Triggers daily macroeconomic intelligence briefings and synchronizes RSS feeds.
 */

const PORT = process.env.PORT || 3005;
const CRON_URL = `http://localhost:${PORT}/api/cron/daily-briefing`;

async function runDailyIngestion() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [MacroPulse Worker] Starting daily macroeconomic briefing ingestion...`);

  try {
    const res = await fetch(CRON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    console.log(`[${timestamp}] [MacroPulse Worker] SUCCESS:`, data.message);
    console.log(`[${timestamp}] [MacroPulse Worker] Total Active Articles: ${data.totalArticlesNow}`);
    console.log(`[${timestamp}] [MacroPulse Worker] New Article Slug: ${data.slug}`);
    return true;
  } catch (err) {
    console.error(`[${timestamp}] [MacroPulse Worker] ERROR:`, err.message);
    return false;
  }
}

// Execute immediately
runDailyIngestion();
