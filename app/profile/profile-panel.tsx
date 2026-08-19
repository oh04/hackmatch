"use client";

import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { User } from "@netlify/identity";
import { getInitials, readBoolean, readList, readText } from "./profile-values";
import { SkillInput } from "./skill-input";

export type ProfilePanelTab = "public" | "personal";

type ProfilePanelProps = {
  user: User;
  initialTab: ProfilePanelTab;
  submitting: boolean;
  authError: string | null;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
};

export function ProfilePanel({
  user,
  initialTab,
  submitting,
  authError,
  onClose,
  onSave,
}: ProfilePanelProps) {
  const metadata = user.userMetadata ?? {};
  const [tab, setTab] = useState<ProfilePanelTab>(initialTab);
  const [fullName, setFullName] = useState(
    readText(metadata.full_name, user.name ?? ""),
  );
  const [role, setRole] = useState(
    readText(metadata.profile_role, "Full-stack builder"),
  );
  const [bio, setBio] = useState(readText(metadata.bio));
  const [location, setLocation] = useState(readText(metadata.location));
  const [availability, setAvailability] = useState(
    readText(metadata.availability, "Full weekend"),
  );
  const [skills, setSkills] = useState(
    readList(metadata.skills, ["TypeScript", "React", "Product"]),
  );
  const [lookingFor, setLookingFor] = useState(
    readList(metadata.looking_for, ["Design", "AI / ML"]),
  );
  const [showEmail, setShowEmail] = useState(
    readBoolean(metadata.show_email),
  );
  const [phone, setPhone] = useState(readText(metadata.private_phone));
  const [emailUpdates, setEmailUpdates] = useState(
    readBoolean(metadata.email_updates, true),
  );
  const [avatarUrl, setAvatarUrl] = useState(
    readText(metadata.avatar_url, user.pictureUrl ?? ""),
  );
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const initials = getInitials(fullName || user.email || "HM");

  async function savePublicProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    setSavedMessage(null);
    const saved = await onSave({
      full_name: fullName.trim(),
      profile_role: role.trim(),
      bio: bio.trim(),
      location: location.trim(),
      availability,
      skills: skills.join(", "),
      looking_for: lookingFor.join(", "),
      show_email: showEmail,
      avatar_url: avatarUrl,
    });
    if (saved) setSavedMessage("Your public profile is updated.");
  }

  async function savePersonalSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalError(null);
    setSavedMessage(null);
    const saved = await onSave({
      private_phone: phone.trim(),
      email_updates: emailUpdates,
    });
    if (saved) setSavedMessage("Your personal settings are saved.");
  }

  async function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setLocalError(null);
    setSavedMessage(null);
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setLocalError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setLocalError("Choose an image smaller than 4 MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("photo", file);
      const response = await fetch("/api/profile-photo", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        throw new Error(result.error || "The photo could not be uploaded.");
      }

      const saved = await onSave({ avatar_url: result.url });
      if (saved) {
        setAvatarUrl(result.url);
        setSavedMessage("Your new profile photo is live.");
      }
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "The photo could not be uploaded.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="modal account-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-panel-title"
      >
        <div className="modal-heading account-panel-heading">
          <div>
            <p className="section-kicker">Your HackMatch account</p>
            <h2 id="account-panel-title">
              {tab === "public" ? "Public profile" : "Personal settings"}
            </h2>
          </div>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close account panel"
          >
            ×
          </button>
        </div>

        <div className="account-tabs" role="tablist" aria-label="Account sections">
          <button
            role="tab"
            aria-selected={tab === "public"}
            className={tab === "public" ? "active" : ""}
            onClick={() => {
              setTab("public");
              setSavedMessage(null);
            }}
          >
            Public profile
          </button>
          <button
            role="tab"
            aria-selected={tab === "personal"}
            className={tab === "personal" ? "active" : ""}
            onClick={() => {
              setTab("personal");
              setSavedMessage(null);
            }}
          >
            Personal settings
          </button>
        </div>

        {(localError || authError) && (
          <p className="auth-message error" role="alert">
            {localError || authError}
          </p>
        )}
        {savedMessage && (
          <p className="auth-message success" role="status">
            {savedMessage}
          </p>
        )}

        {tab === "public" ? (
          <form className="account-form" onSubmit={savePublicProfile}>
            <div className="photo-editor">
              <span className="photo-preview" aria-hidden="true">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="" fill sizes="84px" unoptimized />
                ) : (
                  initials
                )}
              </span>
              <div>
                <strong>Public profile photo</strong>
                <p>JPG, PNG, or WebP. Maximum 4 MB.</p>
                <label className="upload-button">
                  {uploading ? "Uploading…" : "Choose photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={uploadPhoto}
                    disabled={uploading || submitting}
                  />
                </label>
              </div>
            </div>

            <div className="field-grid">
              <label className="field">
                Display name
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </label>
              <label className="field">
                Role
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="Full-stack builder"
                  required
                />
              </label>
              <label className="field">
                Location
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Los Angeles, CA"
                />
              </label>
              <label className="field">
                Availability
                <select
                  value={availability}
                  onChange={(event) => setAvailability(event.target.value)}
                >
                  <option>Full weekend</option>
                  <option>Friday evening – Sunday</option>
                  <option>Saturday – Sunday</option>
                  <option>Remote only</option>
                </select>
              </label>
            </div>

            <label className="field">
              Short bio
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="What do you enjoy building?"
                rows={3}
                maxLength={240}
              />
            </label>
            <SkillInput
              label="Skills you bring"
              hint="Type one skill, then press Enter. Click × to remove one."
              placeholder="e.g. TypeScript"
              values={skills}
              onChange={setSkills}
            />
            <SkillInput
              label="Teammates you're looking for"
              hint="Add the skills or roles you want on your team one at a time."
              placeholder="e.g. Product design"
              values={lookingFor}
              onChange={setLookingFor}
            />
            <label className="check-row">
              <input
                type="checkbox"
                checked={showEmail}
                onChange={(event) => setShowEmail(event.target.checked)}
              />
              Show my account email on my public profile
            </label>
            <button className="modal-primary" type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save public profile"}
            </button>
          </form>
        ) : (
          <form className="account-form" onSubmit={savePersonalSettings}>
            <label className="field">
              Account email
              <input value={user.email ?? ""} readOnly aria-readonly="true" />
              <small>Your login and confirmation emails use this address.</small>
            </label>
            <label className="field">
              Phone number
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Optional — kept private"
                autoComplete="tel"
              />
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={emailUpdates}
                onChange={(event) => setEmailUpdates(event.target.checked)}
              />
              Email me about team invites and important account updates
            </label>
            <div className="privacy-note">
              <strong>Private information stays private.</strong>
              Your phone number and notification choices are not shown on your
              public teammate profile.
            </div>
            <button className="modal-primary" type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save personal settings"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
