import type { Teammate } from "../data/teammates";

type MatchCardProps = {
  teammate: Teammate;
  inviteSent: boolean;
  onViewProfile: () => void;
  onToggleInvite: () => void;
};

export function MatchCard({
  teammate,
  inviteSent,
  onViewProfile,
  onToggleInvite,
}: MatchCardProps) {
  return (
    <article className="match-card">
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
        {teammate.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <p className="match-reason">{teammate.reason}</p>

      <div className="availability">
        <span>Availability</span>
        <strong>{teammate.availability}</strong>
      </div>

      <div className="card-actions">
        <button className="secondary-button" onClick={onViewProfile}>
          View profile
        </button>
        <button
          className={`invite-button ${inviteSent ? "sent" : ""}`}
          onClick={onToggleInvite}
        >
          {inviteSent ? "Invite sent ✓" : "Invite to team"}
        </button>
      </div>
    </article>
  );
}
