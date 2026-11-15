"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/Icons";
import { fetchMe, postJson, type Admin } from "./client";
import styles from "./admin.module.css";

const when = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Dhaka",
});

/**
 * Demo dashboard, rendered in the browser: proves the login worked by
 * showing who the session belongs to. Replace with real admin tools later.
 */
export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [failed, setFailed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchMe(controller.signal)
      .then((me) => {
        if (me) setAdmin(me);
        else router.replace("/admin/login");
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, [router]);

  const signOut = async () => {
    setSigningOut(true);
    await postJson("/api/admin/logout").catch(() => {});
    router.replace("/admin/login");
  };

  return (
    <div className={styles.page}>
      <div className={`${styles.card} ${styles.wide}`}>
        {failed ? (
          <p className={styles.error} role="alert">
            Couldn&apos;t check your session. Reload the page to try again.
          </p>
        ) : !admin ? (
          <p className={styles.loading} role="status">
            Checking your session…
          </p>
        ) : (
          <>
            <div className={styles.head}>
              <div>
                <p className={styles.eyebrow}>Dashboard</p>
                <h1 className={styles.title}>Welcome, {admin.name}</h1>
              </div>
              <button
                type="button"
                className={`${styles.button} ${styles.ghost}`}
                onClick={signOut}
                disabled={signingOut}
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>

            <p className={styles.success} role="status">
              <CheckIcon /> Login successful. Your session is active.
            </p>

            <dl className={styles.facts}>
              <dt>Email</dt>
              <dd>{admin.email}</dd>
              <dt>Role</dt>
              <dd>
                <span className={styles.badge}>{admin.role === "SUPER_ADMIN" ? "Super admin" : "Admin"}</span>
              </dd>
              <dt>Signed in</dt>
              <dd>{admin.lastLoginAt ? when.format(new Date(admin.lastLoginAt)) : "Just now"}</dd>
              <dt>Session ends</dt>
              <dd>{when.format(new Date(admin.sessionExpiresAt))}</dd>
            </dl>
          </>
        )}
      </div>
    </div>
  );
}
