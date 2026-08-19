"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type AccountMenuProps = {
  displayName: string;
  email?: string;
  avatarUrl: string;
  initials: string;
  signingOut: boolean;
  onOpenPublicProfile: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
};

export function AccountMenu({
  displayName,
  email,
  avatarUrl,
  initials,
  signingOut,
  onOpenPublicProfile,
  onOpenSettings,
  onSignOut,
}: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeWhenClickingOutside(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeWhenPressingEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeWhenClickingOutside);
    document.addEventListener("keydown", closeWhenPressingEscape);

    return () => {
      document.removeEventListener("pointerdown", closeWhenClickingOutside);
      document.removeEventListener("keydown", closeWhenPressingEscape);
    };
  }, [open]);

  function choose(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <div className="account-control" ref={menuRef}>
      <button
        className="avatar-button"
        aria-label={`Open account menu for ${displayName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt="" fill sizes="38px" unoptimized />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="account-menu" role="menu">
          <div className="account-menu-header">
            <strong>{displayName}</strong>
            <span>{email}</span>
          </div>

          <button role="menuitem" onClick={() => choose(onOpenPublicProfile)}>
            <span className="menu-icon" aria-hidden="true">◎</span>
            <span>
              <strong>My public profile</strong>
              <small>What teammates see</small>
            </span>
          </button>

          <button role="menuitem" onClick={() => choose(onOpenSettings)}>
            <span className="menu-icon" aria-hidden="true">⚙</span>
            <span>
              <strong>Personal settings</strong>
              <small>Private account details</small>
            </span>
          </button>

          <div className="account-menu-divider" />

          <button
            className="account-menu-signout"
            role="menuitem"
            onClick={() => choose(onSignOut)}
            disabled={signingOut}
          >
            <span className="menu-icon" aria-hidden="true">↗</span>
            <span><strong>Sign out</strong></span>
          </button>
        </div>
      )}
    </div>
  );
}
