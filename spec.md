# Kideo – Product & Technical Specification (Option A)

---

## 1. Overview

**Kideo** is a family-focused web application that helps kids learn responsibility through fun, structure, and rewards. Parents manage a family account where they create tasks and goals for their kids. Kids complete tasks, earn points, build streaks, unlock badges, and redeem rewards that parents define and approve.

The product is designed to be:

- **Educational** – teaches responsibility and consistency
- **Fun** – gamified with points, streaks, timers, and badges
- **Fair** – separates expected family responsibilities from paid chores
- **Future-proof** – built in React with a clear path to a native iOS app

This specification covers the **Option A stack**: React web first, with React Native (Expo) added later, sharing business logic and APIs.

---

## 2. Core Product Principles

1. **Parents stay in control**

   - Parents create tasks, approve completions, and define rewards
   - No points or rewards are granted without parent approval (by default)

2. **Kids are motivated, not overwhelmed**

   - Clear daily tasks
   - Visual progress (points, streaks, badges)
   - Simple interactions and friendly UI

3. **Responsibility before rewards**

   - Some chores are expected because you’re part of a family
   - Not everything earns points

4. **Age-appropriate by design**

   - Tasks and expectations scale with age
   - Templates guide parents toward healthy setups

5. **Cross-platform from day one**

   - Shared logic and validation to support web now and iOS later

---

## 3. Users & Roles

### Parent / Guardian

- Owns the family account
- Creates and manages kid profiles
- Creates tasks and goals
- Approves task completions
- Creates and approves rewards
- Views progress, streaks, and history

### Kid

- Has an individual profile under a family
- Views assigned tasks
- Completes tasks (with optional timers)
- Earns points, streaks, and badges
- Sets yearly goals
- Requests reward redemptions

---

## 4. Core Concepts

### Family

A shared container that includes:

- One or more parents
- One or more kids
- Shared rules, rewards, and tasks

### Kid Profile

Each kid has:

- Name
- Age or date of birth
- Interests (free-form or tag-based)
- Avatar
- Points balance
- Streak status
- Badge collection

---

## 5. Tasks & Chores

### Task Categories

#### Expected Tasks (Unpaid)

- Responsibilities done because you’re part of the family
- Do **not** earn points
- May still count toward streaks or badges (configurable)

**Pro Tip (shown in-app):** Many experts suggest keeping a basic “expected” list of chores (like clearing your own plate) separate from “paid” chores. This helps kids understand that some things are done simply because you are part of a family.

#### Paid Tasks

- Earn points when completed and approved
- Can contribute to streak multipliers

---

### Task Types

- **Individual Task** – assigned to one kid
- **Family Task** – shared task completed together
- **Timed Task** – requires spending a minimum amount of time
- **Beat the Timer** – complete a task faster than a target time for bonus points

---

### Task Properties

Each task can define:

- Title and description
- Category: Expected or Paid
- Points (Paid tasks only)
- Assigned kid or family
- Schedule (daily, weekly, ad hoc)
- Requires approval (default: yes)
- Timer duration (optional)
- Beat-the-timer mode (optional)

---

## 6. Timers

Timed tasks support activities like:

- Reading for 15 minutes
- Cleaning room for 10 minutes

### Timer Rules

- Kid must start a timer session
- Session records start, end, pauses, and total duration
- Task is eligible for completion only if duration >= target time

### Beat the Timer

- A target duration is set
- Completing faster than the target may grant bonus points or badges

---

## 7. Task Completion & Approval Flow

1. Kid marks a task as complete (or finishes timer)
2. A **Task Completion** record is created with status `PENDING`
3. Parent reviews the completion
4. Parent approves or rejects

### On Approval

- Points are awarded (if Paid)
- Streaks are updated
- Badge checks are run

### On Rejection

- No points awarded
- Optional feedback can be given

---

## 8. Points, Streaks & Gamification

### Points

- Only earned from Paid tasks
- Stored as a balance per kid
- Cannot go negative

### Streaks (MVP)

- One overall daily streak per kid
- Increments when at least one scheduled task is approved that day
- Breaks if no approved task on a scheduled day

### Streak Multipliers (configurable defaults)

- 1–2 days: 1.0x
- 3–6 days: 1.2x
- 7+ days: 1.5x

Multipliers apply only to Paid tasks.

---

## 9. Badges

Badges reward consistency and milestones.

### Starter Badge Set

- First Task Completed
- 3-Day Streak
- 7-Day Streak
- Timer Master (5 timed tasks)
- Family Helper (3 family tasks)

Badges are visual only (no points) in MVP.

---

## 10. Goals

Kids can set personal goals, typically yearly.

### Goal Features

- Title and description
- Optional milestones
- Progress tracking (manual or task-linked)
- Visible to parents

Goals are motivational and do not directly award points in MVP.

---

## 11. Rewards

### Reward Definition (Parent)

- Title
- Description
- Point cost
- Availability (active/inactive)
- Optional limits (e.g. once per week)

### Redemption Flow

1. Kid requests a reward
2. Redemption created with status `PENDING`
3. Parent approves or rejects
4. On fulfillment, reward marked `FULFILLED`

Points are deducted only on approval.

---

## 12. Age-Appropriate Task Templates

### Ages 2–3

- Put toys in bins
- Help “dust” with a sock on their hand
- Put laundry in the hamper

### Ages 4–6

- Set the table
- Water plants (small \~250ml watering can)
- Help feed pets

### Ages 7–10

- Load the dishwasher
- Fold towels
- Peel vegetables for dinner

### Ages 11+

- Mow the lawn (with supervision)
- Wash the car
- Cook a simple meal for the family

Templates include suggested category (Expected/Paid) and default points.

---

## 13. Screens & UX (MVP)

### Parent Screens

- Family Dashboard
- Kid Profile (parent view)
- Task Builder & Templates
- Approvals (tasks & rewards)
- Rewards Management
- Family Settings

### Kid Screens

- Kid Home (today’s tasks, points, streak)
- Task Detail & Timer
- Rewards Shop
- Badges Gallery
- Goals

---

## 14. Technical Architecture (Option A)

### Frontend (Web)

- React + Next.js (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query
- Zod

### Backend

- Node.js (Next.js API routes or separate service)
- PostgreSQL
- Prisma ORM

### Authentication

- Clerk (preferred) or Supabase Auth
- Roles: PARENT, KID

### Monorepo Structure

```
kideo/
  apps/
    web/
    mobile/            # Expo later
  packages/
    ui/
    api/
    validators/
    domain/
  prisma/
    schema.prisma
  infra/
    docker/
```

---

## 15. Data Model (Conceptual)

- users
- families
- family\_members
- kids
- tasks
- task\_completions
- timer\_sessions
- rewards
- redemptions
- badges
- kid\_badges
- streaks

---

## 16. API Approach

- Typed API using tRPC (preferred)
- Shared Zod schemas for validation
- Shared domain logic for points, streaks, badges

---

## 17. Deployment

### Development

- Local development with Claude Code
- GitHub for version control

### Production

- VPS deployment
- Docker + Docker Compose
- Services:
  - Web app
  - PostgreSQL
  - Reverse proxy (Caddy or Nginx)

### CI/CD

- GitHub Actions
- Build Docker images
- Pull and deploy on VPS
- Run Prisma migrations on deploy

---

## 18. Non-Functional Requirements

- Mobile-first responsive design
- Fast load times (<2s for kid home)
- Strict role-based access control
- Auditability of approvals and redemptions

---

## 19. MVP Scope Summary

### Must Have

- Family & kid accounts
- Tasks (Expected vs Paid)
- Task completion + approval
- Points
- Rewards + redemption
- Timers
- Streaks
- Badges

### Nice to Have

- Beat the timer bonuses
- Advanced analytics
- Per-task streaks
- Rich goal milestones

---

## 20. Future Extensions

- Native iOS app via Expo (React Native)
- Push notifications
- Offline-friendly timers
- Allowance automation
- Insights for parents (habit trends)

---

End of specification.

