# HackMatch

HackMatch helps hackathon attendees find complementary teammates based on
skills, interests, availability, and working style.

## Why this project exists

Finding a team is often the first stressful part of a hackathon. Skill lists
alone do not explain whether two people can build well together. HackMatch
makes those matches understandable: each score includes a plain-language
reason.

## Current prototype

- Email/password accounts through Netlify Identity
- Email confirmation and password recovery flows
- Responsive teammate discovery dashboard
- Skill-based match filters
- Explainable compatibility scores
- Editable matching profile
- Interactive teammate profiles and invitations
- Accessible focus states and reduced-motion support

Match data is still representative demo data. Persistent profiles and
invitations are planned for the next milestone.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The interface runs with standard Next.js development. Authentication requires
a Netlify project with Identity enabled. After linking the repository to
Netlify, use Netlify Dev when you need to test the complete hosted Identity
environment locally.

## Deploy on Netlify

1. Import this GitHub repository into Netlify.
2. Keep the detected build command `npm run build` and publish directory
   `.next`.
3. Open **Project configuration → Identity** and select **Enable Identity**.
4. Under **Identity → Registration**, keep registration open so new users can
   create accounts.
5. Deploy the site. New accounts receive a confirmation email by default.

No authentication secrets are stored in the repository. Netlify manages the
Identity service and session cookies for the deployed site.

## Product roadmap

1. Store teammate profiles and invitations in a persistent database.
2. Connect every profile to its authenticated owner.
3. Implement and test a weighted matching algorithm.
4. Add hackathon-specific team rooms and availability windows.
5. Collect feedback from real hackathon attendees.

## Tech

TypeScript, React, Next.js, Netlify Identity, and Netlify.

