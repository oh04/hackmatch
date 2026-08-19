# HackMatch

HackMatch helps hackathon attendees find complementary teammates based on
skills, interests, availability, and working style.

## Why this project exists

Finding a team is often the first stressful part of a hackathon. Skill lists
alone do not explain whether two people can build well together. HackMatch is
designed to make those matches understandable: each score includes a plain-
language reason.

## Current prototype

- Responsive teammate discovery dashboard
- Skill-based match filters
- Explainable compatibility scores
- Editable matching profile
- Interactive teammate profiles and invitations
- Accessible focus states and reduced-motion support
- Social sharing metadata and custom preview card

The current data is representative demo data. Persistent profiles,
authentication, and real match storage are planned for the next milestone.

## Product roadmap

1. Store teammate profiles and invitations in a database.
2. Add account sign-in and profile ownership.
3. Implement a tested, weighted matching algorithm.
4. Add hackathon-specific team rooms and availability windows.
5. Collect feedback from real hackathon attendees.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Build the production version with:

```bash
npm run build
```

## Tech

TypeScript, React, vinext, Vite, and Cloudflare Workers-compatible output.

