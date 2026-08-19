"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { AuthMode } from "./use-netlify-auth";

type AuthScreenProps = {
  mode: AuthMode;
  submitting: boolean;
  error: string | null;
  notice: string | null;
  onModeChange: (mode: AuthMode) => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onRecover: (email: string) => Promise<void>;
  onChangePassword: (password: string) => Promise<void>;
};

const modeCopy = {
  login: {
    eyebrow: "Welcome back",
    title: "Sign in to meet your team.",
    submit: "Sign in",
  },
  signup: {
    eyebrow: "Join HackMatch",
    title: "Create your builder profile.",
    submit: "Create account",
  },
  forgot: {
    eyebrow: "Account recovery",
    title: "Reset your password.",
    submit: "Send reset email",
  },
  recovery: {
    eyebrow: "Choose a new password",
    title: "Secure your account.",
    submit: "Update password",
  },
} satisfies Record<AuthMode, { eyebrow: string; title: string; submit: string }>;

export function AuthScreen({
  mode,
  submitting,
  error,
  notice,
  onModeChange,
  onSignIn,
  onSignUp,
  onRecover,
  onChangePassword,
}: AuthScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const copy = modeCopy[mode];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "login") await onSignIn(email, password);
    if (mode === "signup") await onSignUp(name, email, password);
    if (mode === "forgot") await onRecover(email);
    if (mode === "recovery") await onChangePassword(password);
  }

  return (
    <main className="auth-shell">
      <nav className="auth-nav">
        <Link className="brand" href="/" aria-label="HackMatch home">
          <span className="brand-mark">H</span>
          <span>HackMatch</span>
        </Link>
        <span>Better teams build better things.</span>
      </nav>

      <div className="auth-layout">
        <section className="auth-story">
          <p className="eyebrow"><span className="pulse" /> Hackathon team matching</p>
          <h1>Build with people who complete your skill set.</h1>
          <p>
            Find teammates by strengths, interests, availability, and working
            style—with a clear explanation behind every match.
          </p>
          <div className="auth-proof">
            <span><strong>94%</strong> top match</span>
            <span><strong>4</strong> skill signals</span>
            <span><strong>1</strong> shared goal</span>
          </div>
        </section>

        <section className="auth-card" aria-labelledby="auth-title">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 id="auth-title">{copy.title}</h2>

          {notice && <p className="auth-message success" role="status">{notice}</p>}
          {error && <p className="auth-message error" role="alert">{error}</p>}

          <form onSubmit={submit}>
            {mode === "signup" && (
              <label className="field">
                Name
                <input
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Omar Hasan"
                  required
                />
              </label>
            )}

            {mode !== "recovery" && (
              <label className="field">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
            )}

            {mode !== "forgot" && (
              <label className="field">
                {mode === "recovery" ? "New password" : "Password"}
                <input
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  placeholder="At least 8 characters"
                  required
                />
              </label>
            )}

            {mode === "login" && (
              <button
                className="text-button forgot-button"
                type="button"
                onClick={() => onModeChange("forgot")}
              >
                Forgot password?
              </button>
            )}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? "Please wait…" : copy.submit}
            </button>
          </form>

          {mode === "login" && (
            <p className="auth-switch">
              New here? <button onClick={() => onModeChange("signup")}>Create an account</button>
            </p>
          )}
          {mode === "signup" && (
            <p className="auth-switch">
              Already registered? <button onClick={() => onModeChange("login")}>Sign in</button>
            </p>
          )}
          {mode === "forgot" && (
            <p className="auth-switch">
              Remembered it? <button onClick={() => onModeChange("login")}>Back to sign in</button>
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
