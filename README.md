# Sports Blocks

A sports prediction game built with [Next.js](https://nextjs.org) where players purchase blocks on a 10×10 grid tied to live sports games. Winners are determined by the last digit of each team's score at the end of each quarter.

## How the Game Works

### The Grid

Each Blocks game is a **10×10 grid** (100 blocks total) linked to a real sports game. The X-axis represents the **home team** and the Y-axis represents the **away team**. Each block on the grid corresponds to a unique combination of score digits (0–9) for both teams.

### Purchasing Blocks

- Players browse active games and purchase available blocks at a set price per block.
- Each block is assigned a position on the grid (x, y coordinates).
- Axis numbers (0–9) are **randomly shuffled** and assigned to the grid using a Fisher-Yates shuffle — they remain hidden (shown as `?`) until all blocks are sold or the game admin generates them.

### Winning

At the end of each quarter (Q1, Q2, Q3, Q4), the **last digit** of each team's score determines the winning block:

- **X-axis** = last digit of the home team's score
- **Y-axis** = last digit of the away team's score

The player who owns the block at that intersection wins the prize for that quarter. Prize amounts can differ per quarter (e.g. Q4 often has the largest payout).

### Touches (Optional - Not yet implemented)

Games can optionally enable **touches** — additional smaller prizes awarded during scoring events within a quarter, configured with a per-touch prize amount for each quarter.

## Supported Sports

| Sport      | League | Status     |
| ---------- | ------ | ---------- |
| Football   | NFL    | ✅ Active  |
| Basketball | NBA    | ✅ Active  |
| Baseball   | MLB    | 🔜 Planned |
| Hockey     | NHL    | 🔜 Planned |

Live game data is fetched from the [ESPN Scoreboard API](https://site.api.espn.com/apis/site/v2/sports/).

## Cron Jobs

The app uses cron jobs to automate game creation and live score updates.

### Game Setup Cron — `/api/cron/games/setup`

Creates new sports games, blocks games, and blocks for upcoming events.

- Fetches upcoming events from the ESPN API for each active league (NFL, NBA)
- Creates a `sportsGame` record for each event
- Creates a `blocksGame` linked to each sports game with default prize settings
- Generates 100 blocks (10×10 grid) for each blocks game
- Looks ahead **1 day** from the current date

**To run locally:**

```bash
curl http://localhost:3000/api/cron/games/setup
```

### Game Update Cron — `/api/cron/games/update`

Updates live scores, game clock, and status for all active games.

- Finds all sports games with a status of `pre` or `in`
- Fetches live scoreboard data from the ESPN API
- Updates scores (current + per-quarter), game clock, quarter, and status
- Revalidates Next.js pages (`/sports`, `/sports/[league]`) so users see fresh data
- Configured to run **every minute** via Vercel Cron

**To run locally:**

```bash
curl http://localhost:3000/api/cron/games/update
```

### Vercel Cron Configuration

Cron schedules are defined in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/games/update",
      "schedule": "* * * * *"
    }
  ]
}
```

> The setup cron (`/api/cron/games/setup`) is currently triggered manually or on-demand rather than on a fixed schedule.

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/)
- A [Neon](https://neon.tech/) PostgreSQL database

### Install Dependencies

```bash
pnpm install
```

### Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Run Tests

```bash
pnpm vitest
```

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Database:** [Neon PostgreSQL](https://neon.tech/) via [Drizzle ORM](https://orm.drizzle.team/)
- **Auth:** [Better Auth](https://www.better-auth.com/)
- **UI:** [Tailwind CSS 4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Testing:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **Logging:** [Pino](https://getpino.io/)
- **Deployment:** [Vercel](https://vercel.com/)
