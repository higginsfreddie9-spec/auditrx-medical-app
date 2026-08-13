"use client";

import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="underline decoration-hairline underline-offset-2 hover:text-ink"
    >
      Sign out
    </button>
  );
}
