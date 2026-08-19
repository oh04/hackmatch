"use client";

import { useMemo, useState } from "react";

type Teammate = {
  id: number;
  initials: string;
  name: string;
  role: string;
  match: number;
  availability: string;
  status: string;
  statusTone: "green" | "amber" | "blue";
  skills: string[];
  categories: string[];
  reason: string;
  color: string;
};

const teammates: Teammate[] = [
  {
    id: 1,
    initials: "MK",
    name: "Maya Kim",
    role: "Product designer",
    match: 94,
    availability: "Full weekend",
    status: "Online now",
    statusTone: "green",
    skills: ["Figma", "UX research", "Prototyping"],
    categories: ["Design"],
    reason: "You need product design. Maya wants a technical teammate and shares your climate-tech interest.",
    color: "coral",
  },
  {
    id: 2,
    initials: "JL",
    name: "Jordan Lee",
    role: "ML engineer",
    match: 89,
    availability: "Fri evening – Sun",
    status: "Replies quickly",
    statusTone: "blue",
    skills: ["Python", "PyTorch", "FastAPI"],
    categories: ["AI / ML", "Backend"],
    reason: "Jordan brings the recommendation experience your idea needs, while you cover the product frontend.",
    color: "lime",
  },
  {
    id: 3,
    initials: "AP",
    name: "Avery Patel",
    role: "Frontend developer",
    match: 82,
    availability: "Sat – Sun",
    status: "2 team spots open",
    statusTone: "amber",
    skills: ["TypeScript", "React", "Accessibility"],
    categories: ["Frontend"],
    reason: "Avery matches your pace and cares about accessible civic-tech products. Both of you want to ship a live demo.",
    color: "violet",
  },
  {
    id: 4,
    initials: "NS",
    name: "Noah Santos",
    role: "Backend developer",
    match: 78,
    availability: "Full weekend",
    status: "New match",
    statusTone: "green",
    skills: ["Node.js", "PostgreSQL", "APIs"],
    categories: ["Backend"],
    reason: "Noah can own data and deployment while you focus on the matching experience and interface.",
    color: "blue",
  },
];

const filters = ["All matches", "Frontend", "Backend", "AI / ML", "Design"];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All matches");
  const [invited, setInvited] = useState<number[]>([]);
  const [profileRole, setProfileRole] = useState("Full-stack builder");
  const [editingProfile, setEditingProfile] = useState(false);
  const [selectedTeammate, setSelectedTeammate] = useState<Teammate | null>(null);

  const visibleTeammates = useMemo(
    () =>
      activeFilter === "All matches"
        ? teammates
        : teammates.filter((teammate) =>
            teammate.categories.includes(activeFilter),
          ),
    [activeFilter],
  );

  function toggleInvite(id: number) {
    setInvited((current) =>
      current.includes(id)
        ? current.filter((teammateId) => teammateId !== id)
        : [...current, id],
    );
  }

  return (
    <main>
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="HackMatch home">
          <span className="brand-mark">H</span>
          <span>HackMatch</span>
        </a>
        <div className="nav-links">
          <a href="#matches">Discover</a>
          <a href="#profile">My profile</a>
          <button className="avatar-button" aria-label="Open account menu">
            OH
          </button>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="pulse" /> Built for hackathon weekend
          </p>
          <h1>
            Find the teammate
            <br />
            your idea is <em>missing.</em>
          </h1>
          <p className="hero-description">
            Match by skills, interests, and working style—so you can spend less
            time searching and more time shipping.
          </p>
          <a className="primary-button" href="#matches">
            Explore your matches <span aria-hidden="true">↘</span>
          </a>
        </div>

        <aside className="profile-card" id="profile">
          <div className="profile-card-top">
            <span>Your matching profile</span>
            <button onClick={() => setEditingProfile(true)}>Edit</button>
          </div>
          <div className="profile-person">
            <span className="profile-avatar">OH</span>
            <div>
              <strong>Omar Hasan</strong>
              <span>{profileRole}</span>
            </div>
          </div>
          <div className="profile-row">
            <span>I bring</span>
            <div><b>TypeScript</b><b>React</b><b>Product</b></div>
          </div>
          <div className="profile-row">
            <span>I&apos;m looking for</span>
            <div><b>Design</b><b>AI / ML</b></div>
          </div>
          <div className="profile-footer">
            <span>Profile strength</span>
            <span className="strength-track"><i /></span>
            <strong>80%</strong>
          </div>
        </aside>
      </section>

      <section className="matches-section" id="matches">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Curated for you</p>
            <h2>Your best matches</h2>
          </div>
          <p>Based on your skills, goals, and availability.</p>
        </div>

        <div className="filters" aria-label="Filter teammate matches">
          {filters.map((filter) => (
            <button
              className={activeFilter === filter ? "active" : ""}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="match-grid" aria-live="polite">
          {visibleTeammates.map((teammate) => {
            const inviteSent = invited.includes(teammate.id);
            return (
              <article className="match-card" key={teammate.id}>
                <div className="card-topline">
                  <span className={`status ${teammate.statusTone}`}>
                    {teammate.status}
                  </span>
                  <span className="match-score">
                    <strong>{teammate.match}%</strong> match
                  </span>
                </div>
                <div className="person">
                  <span className={`person-avatar ${teammate.color}`}>
                    {teammate.initials}
                  </span>
                  <div>
                    <h3>{teammate.name}</h3>
                    <p>{teammate.role}</p>
                  </div>
                </div>
                <div className="skills">
                  {teammate.skills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
                <p className="match-reason">{teammate.reason}</p>
                <div className="availability">
                  <span>Availability</span>
                  <strong>{teammate.availability}</strong>
                </div>
                <div className="card-actions">
                  <button
                    className="secondary-button"
                    onClick={() => setSelectedTeammate(teammate)}
                  >
                    View profile
                  </button>
                  <button
                    className={`invite-button ${inviteSent ? "sent" : ""}`}
                    onClick={() => toggleInvite(teammate.id)}
                  >
                    {inviteSent ? "Invite sent ✓" : "Invite to team"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer>
        <span>HackMatch</span>
        <p>Better teams build better things.</p>
        <span>Prototype · 2026</span>
      </footer>

      {editingProfile && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            <div className="modal-heading">
              <div>
                <p className="section-kicker">Matching profile</p>
                <h2 id="edit-profile-title">What do you build?</h2>
              </div>
              <button
                className="close-button"
                onClick={() => setEditingProfile(false)}
                aria-label="Close profile editor"
              >
                ×
              </button>
            </div>
            <label className="field">
              Your role
              <input
                value={profileRole}
                onChange={(event) => setProfileRole(event.target.value)}
                placeholder="Full-stack builder"
              />
            </label>
            <div className="modal-note">
              <strong>Why this matters</strong>
              Clear roles improve your match explanations and help teammates
              understand where you fit.
            </div>
            <button
              className="modal-primary"
              onClick={() => setEditingProfile(false)}
            >
              Save profile
            </button>
          </section>
        </div>
      )}

      {selectedTeammate && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="teammate-profile-title"
          >
            <div className="modal-heading">
              <div className="person modal-person">
                <span className={`person-avatar ${selectedTeammate.color}`}>
                  {selectedTeammate.initials}
                </span>
                <div>
                  <h2 id="teammate-profile-title">{selectedTeammate.name}</h2>
                  <p>{selectedTeammate.role}</p>
                </div>
              </div>
              <button
                className="close-button"
                onClick={() => setSelectedTeammate(null)}
                aria-label="Close teammate profile"
              >
                ×
              </button>
            </div>
            <div className="profile-match-callout">
              <strong>{selectedTeammate.match}% match</strong>
              <p>{selectedTeammate.reason}</p>
            </div>
            <div className="skills modal-skills">
              {selectedTeammate.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <button
              className={`modal-primary ${invited.includes(selectedTeammate.id) ? "sent" : ""}`}
              onClick={() => toggleInvite(selectedTeammate.id)}
            >
              {invited.includes(selectedTeammate.id)
                ? "Invite sent ✓"
                : "Invite to your team"}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
