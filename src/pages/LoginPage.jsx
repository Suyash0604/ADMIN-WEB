import { useState } from "react";
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import markyticsLogo from "../assets/markytics-logo.png";

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
    <div className="relative min-h-screen overflow-hidden bg-[#dfe8f0] text-ink dark:bg-[#080a0f]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/25 via-[#e8eef5] to-brand-mint/20 dark:from-brand/30 dark:via-[#0b0f16] dark:to-brand-dark/25" />
        <div className="absolute -left-28 top-[12%] h-[28rem] w-[28rem] rounded-full bg-brand/30 blur-[110px] dark:bg-brand/20" />
        <div className="absolute -right-20 top-[-6%] h-80 w-80 rounded-full bg-brand-mint/25 blur-[100px] dark:bg-brand-mint/10" />
        <div className="absolute bottom-[-8%] left-[28%] h-72 w-72 rounded-full bg-brand-dark/20 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-40 dark:opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(44,119,163,0.18) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20 dark:from-black/20 dark:to-transparent" />
      </div>

      <div className="absolute left-6 top-6 z-10 flex items-center gap-2.5 rounded-2xl border border-white/50 bg-white/45 px-3 py-2 shadow-[0_8px_24px_rgba(44,119,163,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <img
          src={markyticsLogo}
          alt="Markytics"
          className="h-9 w-9 rounded-xl object-contain"
        />
        <span className="text-sm font-bold text-ink">
          Markytics <span className="text-brand">Admin</span>
        </span>
      </div>

      <div className="absolute right-6 top-6 z-10 rounded-xl border border-white/50 bg-white/45 p-1 shadow-[0_8px_24px_rgba(44,119,163,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <ThemeToggle />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/55 shadow-[0_20px_60px_rgba(44,119,163,0.14),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.07] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="brand-gradient h-1 w-full opacity-90" />

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
                  className="h-11 w-full rounded-xl border border-white/50 bg-white/50 px-3.5 text-sm font-medium text-ink outline-none backdrop-blur-sm transition placeholder:text-zinc-900/50 focus:border-brand/40 focus:bg-white/70 focus:ring-2 focus:ring-brand/15 dark:border-white/10 dark:bg-white/[0.06] dark:placeholder:text-neutral-500 dark:focus:bg-white/10"
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
                    className="h-11 w-full rounded-xl border border-white/50 bg-white/50 px-3.5 pr-11 text-sm font-medium text-ink outline-none backdrop-blur-sm transition placeholder:text-zinc-900/50 focus:border-brand/40 focus:bg-white/70 focus:ring-2 focus:ring-brand/15 dark:border-white/10 dark:bg-white/[0.06] dark:placeholder:text-neutral-500 dark:focus:bg-white/10"
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

        <p className="mt-6 flex items-center gap-2 rounded-full border border-white/40 bg-white/35 px-4 py-2 text-xs font-medium text-zinc-900/70 shadow-[0_4px_16px_rgba(44,119,163,0.08)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05] dark:text-neutral-400">
          A product by <span className="font-bold text-ink">Markytics.AI</span>
          <img
            src={markyticsLogo}
            alt="Markytics"
            className="h-5 w-5 rounded object-contain"
          />
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
