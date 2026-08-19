"use client";

import {
  getUser,
  handleAuthCallback,
  login,
  logout,
  onAuthChange,
  requestPasswordRecovery,
  signup,
  updateUser,
  type User,
} from "@netlify/identity";
import { useEffect, useState } from "react";

export type AuthMode = "login" | "signup" | "forgot" | "recovery";

function messageFrom(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export function useNetlifyAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthChange((_event, nextUser) => {
      if (active) setUser(nextUser);
    });

    async function start() {
      try {
        const callback = await handleAuthCallback();
        if (!active) return;

        if (callback?.type === "recovery") {
          setMode("recovery");
          setUser(callback.user);
        } else if (callback?.type === "confirmation") {
          setNotice("Email confirmed. Welcome to HackMatch!");
          setUser(callback.user);
        } else {
          setUser(callback?.user ?? (await getUser()));
        }
      } catch (startError) {
        if (active) setError(messageFrom(startError));
      } finally {
        if (active) setLoading(false);
      }
    }

    void start();
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function run(action: () => Promise<void>) {
    setSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      await action();
    } catch (actionError) {
      setError(messageFrom(actionError));
    } finally {
      setSubmitting(false);
    }
  }

  async function signIn(email: string, password: string) {
    await run(async () => {
      const nextUser = await login(email, password);
      setUser(nextUser);
    });
  }

  async function createAccount(name: string, email: string, password: string) {
    await run(async () => {
      const nextUser = await signup(email, password, { full_name: name });
      if (nextUser.confirmedAt) {
        setUser(nextUser);
      } else {
        setMode("login");
        setNotice("Check your email to confirm your account, then sign in.");
      }
    });
  }

  async function sendRecovery(email: string) {
    await run(async () => {
      await requestPasswordRecovery(email);
      setMode("login");
      setNotice("Password reset email sent. Check your inbox.");
    });
  }

  async function changePassword(password: string) {
    await run(async () => {
      const nextUser = await updateUser({ password });
      setUser(nextUser);
      setMode("login");
      setNotice("Password updated successfully.");
    });
  }

  async function signOut() {
    await run(async () => {
      await logout();
      setUser(null);
      setMode("login");
    });
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    setNotice(null);
  }

  return {
    user,
    mode,
    loading,
    submitting,
    error,
    notice,
    signIn,
    createAccount,
    sendRecovery,
    changePassword,
    signOut,
    changeMode,
  };
}
