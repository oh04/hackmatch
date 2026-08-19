"use client";

import { useState, type KeyboardEvent } from "react";

type SkillInputProps = {
  label: string;
  hint: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
};

export function SkillInput({
  label,
  hint,
  placeholder,
  values,
  onChange,
}: SkillInputProps) {
  const [draft, setDraft] = useState("");

  function addSkill() {
    const skill = draft.trim();
    if (!skill) return;

    const alreadyAdded = values.some(
      (value) => value.toLowerCase() === skill.toLowerCase(),
    );

    if (!alreadyAdded) onChange([...values, skill]);
    setDraft("");
  }

  function addSkillOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addSkill();
  }

  function removeSkill(skillToRemove: string) {
    onChange(values.filter((skill) => skill !== skillToRemove));
  }

  return (
    <div className="field skill-entry">
      <span>{label}</span>
      <div className="skill-input-row">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={addSkillOnEnter}
          placeholder={placeholder}
        />
        <button type="button" onClick={addSkill} disabled={!draft.trim()}>
          Add
        </button>
      </div>
      <small>{hint}</small>
      <div className="skill-bubbles" aria-live="polite">
        {values.map((skill) => (
          <span className="skill-bubble" key={skill}>
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
