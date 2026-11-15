"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMe, postJson } from "../client";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  // Already signed in? Skip the form.
  useEffect(() => {
    const controller = new AbortController();
    fetchMe(controller.signal)
      .then((admin) => {
        if (admin) router.replace("/admin");
      })
      .catch(() => {});
    return () => controller.abort();
  }, [router]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const res = await postJson("/api/admin/login", { email, password });
      if (res.ok) {
        router.replace("/admin");
        return;
      }
      setError(res.data.error ?? "Couldn't sign in. Try again.");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    }
    setPending(false);
    setPassword("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Onyx Q admin</p>
        <h1 className={styles.title}>Sign in</h1>

        <form onSubmit={onSubmit} className={styles.form} noValidate>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <label className={styles.field}>
            Email
            <input
              className={styles.input}
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className={styles.field}>
            Password
            <input
              className={styles.input}
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className={styles.button} disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className={styles.note}>Accounts are created by a super admin. There is no public sign-up.</p>
      </div>
    </div>
  );
}
