import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="eyebrow">Sign in</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
        Access your saved audits
      </h1>
      <p className="mt-2 font-body text-sm text-slate">
        Enter the email you used to pay for an audit, or sign in to start tracking a new one.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </div>
  );
}
