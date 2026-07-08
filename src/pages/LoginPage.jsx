import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand/10" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />

      <div className="absolute left-6 top-6 z-10 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
          <span className="text-sm font-extrabold">V3</span>
        </div>
        <span className="text-sm font-bold text-ink">
          PlatformV3 <span className="text-brand">Admin</span>
        </span>
      </div>

      <div className="absolute right-6 top-6 z-10">
        <ThemeToggle />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-hairline bg-surface shadow-[0_24px_70px_rgba(13,13,13,0.12)]">
          <div className="brand-gradient h-1 w-full" />

          <div className="p-8">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Secure sign in
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm font-medium text-zinc-900 dark:text-neutral-400">
              Sign in to access your admin console.
            </p>

            {error && (
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-sm font-medium text-red-600 dark:text-red-400">
                <AlertCircle size={17} strokeWidth={2.2} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-zinc-900 dark:text-neutral-400"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@platformv3.com"
                  className="h-11 w-full rounded-xl border border-hairline bg-canvas px-3.5 text-sm font-medium text-ink outline-none transition placeholder:text-zinc-900/50 dark:placeholder:text-neutral-500 focus:border-brand/40 focus:bg-surface focus:ring-2 focus:ring-brand/15"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-zinc-900 dark:text-neutral-400"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-xl border border-hairline bg-canvas px-3.5 pr-11 text-sm font-medium text-ink outline-none transition placeholder:text-zinc-900/50 dark:placeholder:text-neutral-500 focus:border-brand/40 focus:bg-surface focus:ring-2 focus:ring-brand/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-900 transition hover:bg-neutral-100 hover:text-ink dark:text-neutral-400 dark:hover:bg-white/10"
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={2.2} />
                    ) : (
                      <Eye size={16} strokeWidth={2.2} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white shadow-[0_10px_28px_rgba(44,119,163,0.30)] transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} strokeWidth={2.4} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={17} strokeWidth={2.4} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-xs font-medium text-zinc-900/60 dark:text-neutral-500">
          A product by <span className="font-bold text-ink">Markytics.AI</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
