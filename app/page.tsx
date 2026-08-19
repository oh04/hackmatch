"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AccountMenu } from "./components/account-menu";
import { MatchCard } from "./components/match-card";
import { matchFilters, teammates, type Teammate } from "./data/teammates";
import { AuthScreen } from "./auth/auth-screen";
import { useNetlifyAuth } from "./auth/use-netlify-auth";
import { ProfilePanel, type ProfilePanelTab } from "./profile/profile-panel";
import { getInitials, readList, readText } from "./profile/profile-values";

export default function Home() {
  const auth = useNetlifyAuth();
  const [activeFilter, setActiveFilter] = useState("All matches");
  const [invited, setInvited] = useState<number[]>([]);
  const [profilePanel, setProfilePanel] = useState<ProfilePanelTab | null>(null);
  const [selectedTeammate, setSelectedTeammate] = useState<Teammate | null>(null);

  const filteredTeammates = useMemo(
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

  if (auth.loading) {
    return (
      <main className="auth-loading" aria-live="polite">
        <span className="brand-mark">H</span>
        <strong>Opening HackMatch…</strong>
      </main>
    );
  }

  if (!auth.user) {
    return (
      <AuthScreen
        mode={auth.mode}
        submitting={auth.submitting}
        error={auth.error}
        notice={auth.notice}
        onModeChange={auth.changeMode}
        onSignIn={auth.signIn}
        onSignUp={auth.createAccount}
        onRecover={auth.sendRecovery}
        onChangePassword={auth.changePassword}
      />
    );
  }

  const metadata = auth.user.userMetadata ?? {};
  const displayName =
    readText(metadata.full_name).trim() ||
    auth.user.name ||
    auth.user.email?.split("@")[0] ||
    "HackMatch builder";
  const profileRole =
    readText(metadata.profile_role).trim() ||
    "Full-stack builder";
  const avatarUrl =
    readText(metadata.avatar_url).trim() ||
    auth.user.pictureUrl ||
    "";
  const profileSkills = readList(metadata.skills, [
    "TypeScript",
    "React",
    "Product",
  ]);
  const profileNeeds = readList(metadata.looking_for, ["Design", "AI / ML"]);
  const initials = getInitials(displayName);

  return (
    <main>
      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="HackMatch home">
          <span className="brand-mark">H</span>
          <span>HackMatch</span>
        </a>
        <div className="nav-links">
          <a href="#matches">Discover</a>
          <button
            className="nav-profile-button"
            onClick={() => setProfilePanel("public")}
          >
            My profile
          </button>
          <AccountMenu
            displayName={displayName}
            email={auth.user.email}
            avatarUrl={avatarUrl}
            initials={initials}
            signingOut={auth.submitting}
            onOpenPublicProfile={() => setProfilePanel("public")}
            onOpenSettings={() => setProfilePanel("personal")}
            onSignOut={() => void auth.signOut()}
          />
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
            <button onClick={() => setProfilePanel("public")}>Edit</button>
          </div>
          <div className="profile-person">
            <span className="profile-avatar">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="" fill sizes="52px" unoptimized />
              ) : (
                initials
              )}
            </span>
            <div>
              <strong>{displayName}</strong>
              <span>{profileRole}</span>
            </div>
          </div>
          <div className="profile-row">
            <span>I bring</span>
            <div>
              {profileSkills.map((skill) => <b key={skill}>{skill}</b>)}
            </div>
          </div>
          <div className="profile-row">
            <span>I&apos;m looking for</span>
            <div>
              {profileNeeds.map((skill) => <b key={skill}>{skill}</b>)}
            </div>
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
          {matchFilters.map((filter) => (
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
          {filteredTeammates.map((teammate) => {
            const inviteSent = invited.includes(teammate.id);
            return (
              <MatchCard
                key={teammate.id}
                teammate={teammate}
                inviteSent={inviteSent}
                onViewProfile={() => setSelectedTeammate(teammate)}
                onToggleInvite={() => toggleInvite(teammate.id)}
              />
            );
          })}
        </div>
      </section>

      <footer>
        <span>HackMatch</span>
        <p>Better teams build better things.</p>
        <span>Prototype · 2026</span>
      </footer>

      {profilePanel && (
        <ProfilePanel
          user={auth.user}
          initialTab={profilePanel}
          submitting={auth.submitting}
          authError={auth.error}
          onClose={() => setProfilePanel(null)}
          onSave={auth.updateProfile}
        />
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
