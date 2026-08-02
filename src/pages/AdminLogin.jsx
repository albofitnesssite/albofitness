import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "../services/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();

  // ==========================================
  // AUTH MODE
  // ==========================================

  const [mode, setMode] = useState("login");

  // ==========================================
  // LOGIN
  // ==========================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  // ==========================================
  // PASSWORD RECOVERY
  // ==========================================

  const [resetEmail, setResetEmail] =
    useState("");

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  // ==========================================
  // UI STATE
  // ==========================================

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [notice, setNotice] = useState("");

  // ==========================================
  // HELPERS
  // ==========================================

  function clearMessages() {
    setError("");
    setNotice("");
  }

  function normalizeEmail(value) {
    return value.trim().toLowerCase();
  }

  function switchMode(nextMode) {
    clearMessages();

    setMode(nextMode);
  }

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  async function handleLogin(event) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    clearMessages();

    const normalizedEmail =
      normalizeEmail(email);

    if (!normalizedEmail) {
      setError("Enter the admin email.");
      return;
    }

    if (!password) {
      setError("Enter the admin password.");
      return;
    }

    setIsLoading(true);

    try {
      const {
        data,
        error: loginError,
      } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (loginError) {
        console.error(
          "ALBO ADMIN LOGIN ERROR",
          {
            message: loginError.message,
            status: loginError.status,
            code: loginError.code,
            name: loginError.name,
          }
        );

        setError(
          "Invalid admin email or password."
        );

        return;
      }

      if (!data?.session) {
        setError(
          "Admin session could not be created."
        );

        return;
      }

      navigate("/admin/dashboard");
    } catch (loginException) {
      console.error(
        "ALBO ADMIN LOGIN EXCEPTION",
        loginException
      );

      setError(
        "Unable to connect to the authentication service."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ==========================================
  // SEND RECOVERY OTP
  // ==========================================

  async function sendRecoveryOtp(event) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    clearMessages();

    const normalizedEmail =
      normalizeEmail(resetEmail);

    if (!normalizedEmail) {
      setError(
        "Enter the registered admin email."
      );

      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl =
        `${window.location.origin}/admin`;

      console.log(
        "================================"
      );

      console.log(
        "ALBO PASSWORD RECOVERY REQUEST"
      );

      console.log(
        "Recovery email:",
        normalizedEmail
      );

      console.log(
        "Recovery redirect:",
        redirectUrl
      );

      const {
        data,
        error: resetError,
      } =
        await supabase.auth
          .resetPasswordForEmail(
            normalizedEmail,
            {
              redirectTo: redirectUrl,
            }
          );

      console.log(
        "Recovery response data:",
        data
      );

      if (resetError) {
        console.error(
          "ALBO RECOVERY ERROR"
        );

        console.error({
          message: resetError.message,
          status: resetError.status,
          code: resetError.code,
          name: resetError.name,
        });

        console.log(
          "================================"
        );

        /*
         * 500 = Supabase server-side problem.
         *
         * Usually:
         * SMTP
         * Auth email delivery
         * Auth database trigger
         * Auth configuration
         */

        if (resetError.status === 500) {
          setError(
            "Supabase could not process the recovery email. Check Supabase Auth Logs and email delivery configuration."
          );

          return;
        }

        if (resetError.status === 429) {
          setError(
            "Too many recovery attempts. Wait before requesting another OTP."
          );

          return;
        }

        setError(
          resetError.message ||
            "Unable to send the recovery OTP."
        );

        return;
      }

      setResetEmail(normalizedEmail);

      setNotice(
        "If this is the registered ALBO admin email, a recovery OTP has been sent."
      );

      setMode("verify");

      console.log(
        "Recovery request accepted."
      );

      console.log(
        "================================"
      );
    } catch (recoveryException) {
      console.error(
        "ALBO RECOVERY EXCEPTION",
        recoveryException
      );

      setError(
        "Unable to connect to Supabase Auth."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ==========================================
  // VERIFY RECOVERY OTP
  // ==========================================

  async function verifyRecoveryOtp(event) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    clearMessages();

    const normalizedEmail =
      normalizeEmail(resetEmail);

    const normalizedOtp = otp
      .replace(/\D/g, "")
      .trim();

    if (!normalizedEmail) {
      setError(
        "Recovery email is missing. Request a new OTP."
      );

      setMode("forgot");

      return;
    }

    if (!/^\d{6,8}$/.test(normalizedOtp)) {
      setError(
        "Enter the OTP from the registered email."
      );

      return;
    }

    setIsLoading(true);

    try {
      const {
        data,
        error: verifyError,
      } =
        await supabase.auth.verifyOtp({
          email: normalizedEmail,
          token: normalizedOtp,
          type: "recovery",
        });

      if (verifyError) {
        console.error(
          "ALBO OTP VERIFY ERROR",
          {
            message: verifyError.message,
            status: verifyError.status,
            code: verifyError.code,
            name: verifyError.name,
          }
        );

        setError(
          "Invalid or expired OTP. Request a new recovery code."
        );

        return;
      }

      if (!data?.session) {
        console.error(
          "OTP verified without recovery session:",
          data
        );

        setError(
          "Recovery session was not created. Request a new OTP."
        );

        return;
      }

      setNotice(
        "Email verified. Create your new admin password."
      );

      setMode("new-password");
    } catch (verifyException) {
      console.error(
        "ALBO OTP VERIFY EXCEPTION",
        verifyException
      );

      setError(
        "Unable to verify the recovery OTP."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  async function changePassword(event) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    clearMessages();

    if (newPassword.length < 8) {
      setError(
        "New password must contain at least 8 characters."
      );

      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      setError(
        "The new passwords do not match."
      );

      return;
    }

    setIsLoading(true);

    try {
      /*
       * IMPORTANT
       *
       * verifyOtp(type: recovery)
       * creates an authenticated recovery session.
       *
       * updateUser then changes the password
       * of that authenticated Supabase Auth user.
       */

      const {
        data: sessionData,
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error(
          "RECOVERY SESSION ERROR",
          sessionError
        );

        setError(
          "Unable to validate the recovery session."
        );

        return;
      }

      if (!sessionData?.session) {
        setError(
          "Recovery session expired. Request a new OTP."
        );

        setMode("forgot");

        return;
      }

      const {
        data,
        error: updateError,
      } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        console.error(
          "ALBO PASSWORD UPDATE ERROR",
          {
            message: updateError.message,
            status: updateError.status,
            code: updateError.code,
            name: updateError.name,
          }
        );

        setError(
          updateError.message ||
            "Unable to update the password."
        );

        return;
      }

      console.log(
        "PASSWORD UPDATED FOR USER:",
        data?.user?.id
      );

      await supabase.auth.signOut();

      setEmail(
        normalizeEmail(resetEmail)
      );

      setPassword("");

      setOtp("");

      setNewPassword("");

      setConfirmPassword("");

      setMode("login");

      setNotice(
        "Password changed in Supabase Auth. Sign in with your new password."
      );
    } catch (passwordException) {
      console.error(
        "ALBO PASSWORD CHANGE EXCEPTION",
        passwordException
      );

      setError(
        "Unable to change the admin password."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="admin-auth min-h-screen bg-[#050505] text-white">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        {/* ======================================
            LEFT BRAND PANEL
        ====================================== */}

        <aside className="relative hidden overflow-hidden border-r border-[#292929] bg-[#E85D2A] p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 top-24 text-[18rem] font-black leading-none text-black/[0.06]">
            A
          </div>

          <div className="relative z-10">
            <p className="auth-kicker text-black">
              ALBO FITNESS / ADMIN
            </p>

            <h1 className="auth-display mt-8 max-w-xl text-black">
              CONTROL
              <br />
              THE FLOOR.
            </h1>
          </div>

          <div className="relative z-10 max-w-md border-t border-black/25 pt-6">
            <ShieldCheck
              size={25}
              className="mb-4 text-black"
            />

            <p className="text-sm font-bold uppercase leading-6 tracking-[0.08em] text-black/70">
              Trainer profiles. Member feedback.
              Transformations. Gym operations.
            </p>
          </div>
        </aside>

        {/* ======================================
            AUTH PANEL
        ====================================== */}

        <section className="relative flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="absolute left-0 top-0 h-[3px] w-full bg-[#E85D2A]" />

          <div className="w-full max-w-md">
            {/* ==================================
                HEADER
            ================================== */}

            <div className="mb-10">
              <p className="auth-kicker">
                SECURE ADMIN ACCESS
              </p>

              <h2 className="auth-display mt-4 text-5xl sm:text-6xl">
                {mode === "login" && (
                  <>SIGN IN.</>
                )}

                {mode === "forgot" && (
                  <>
                    RESET
                    <br />
                    ACCESS.
                  </>
                )}

                {mode === "verify" && (
                  <>
                    VERIFY
                    <br />
                    EMAIL.
                  </>
                )}

                {mode ===
                  "new-password" && (
                  <>
                    NEW
                    <br />
                    PASSWORD.
                  </>
                )}
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-6 text-[#8F8F8F]">
                {mode === "login" &&
                  "Use the registered Supabase admin account to enter the dashboard."}

                {mode === "forgot" &&
                  "Enter the registered admin email. Recovery is handled by Supabase Auth."}

                {mode === "verify" &&
                  `Enter the recovery OTP sent to ${resetEmail}.`}

                {mode ===
                  "new-password" &&
                  "The verified recovery session can now update the Supabase Auth password."}
              </p>
            </div>

            {/* ==================================
                MESSAGES
            ================================== */}

            {error && (
              <Message
                type="error"
                text={error}
              />
            )}

            {notice && (
              <Message
                type="notice"
                text={notice}
              />
            )}

            {/* ==================================
                LOGIN
            ================================== */}

            {mode === "login" && (
              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <FieldLabel>
                  Email address
                </FieldLabel>

                <InputShell
                  icon={<Mail size={18} />}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    required
                    autoComplete="email"
                    placeholder="admin@albofitness.com"
                    className="auth-input"
                  />
                </InputShell>

                <div className="flex items-center justify-between pt-1">
                  <FieldLabel>
                    Password
                  </FieldLabel>

                  <button
                    type="button"
                    onClick={() =>
                      switchMode("forgot")
                    }
                    className="text-[10px] font-black uppercase tracking-[0.18em] text-[#E85D2A] hover:text-white"
                  >
                    Forgot password?
                  </button>
                </div>

                <InputShell
                  icon={<Lock size={18} />}
                >
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="auth-input pr-12"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </InputShell>

                <SubmitButton
                  loading={isLoading}
                >
                  Enter dashboard
                </SubmitButton>
              </form>
            )}

            {/* ==================================
                FORGOT PASSWORD
            ================================== */}

            {mode === "forgot" && (
              <form
                onSubmit={sendRecoveryOtp}
                className="space-y-5"
              >
                <FieldLabel>
                  Registered admin email
                </FieldLabel>

                <InputShell
                  icon={<Mail size={18} />}
                >
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(event) =>
                      setResetEmail(
                        event.target.value
                      )
                    }
                    required
                    autoComplete="email"
                    placeholder="admin@albofitness.com"
                    className="auth-input"
                  />
                </InputShell>

                <SubmitButton
                  loading={isLoading}
                >
                  Send recovery OTP
                </SubmitButton>

                <BackButton
                  onClick={() =>
                    switchMode("login")
                  }
                />
              </form>
            )}

            {/* ==================================
                OTP VERIFICATION
            ================================== */}

            {mode === "verify" && (
              <form
                onSubmit={verifyRecoveryOtp}
                className="space-y-5"
              >
                <FieldLabel>
                  Email OTP
                </FieldLabel>

                <InputShell
                  icon={
                    <KeyRound size={18} />
                  }
                >
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 8)
                      )
                    }
                    required
                    placeholder="000000"
                    className="auth-input text-2xl font-black tracking-[0.35em]"
                  />
                </InputShell>

                <SubmitButton
                  loading={isLoading}
                >
                  Verify OTP
                </SubmitButton>

                <button
                  type="button"
                  onClick={() =>
                    switchMode("forgot")
                  }
                  className="w-full text-center text-[10px] font-black uppercase tracking-[0.18em] text-[#777] hover:text-[#E85D2A]"
                >
                  Request another code
                </button>
              </form>
            )}

            {/* ==================================
                NEW PASSWORD
            ================================== */}

            {mode ===
              "new-password" && (
              <form
                onSubmit={changePassword}
                className="space-y-5"
              >
                <FieldLabel>
                  New password
                </FieldLabel>

                <InputShell
                  icon={<Lock size={18} />}
                >
                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value
                      )
                    }
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    className="auth-input pr-12"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] hover:text-white"
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </InputShell>

                <FieldLabel>
                  Confirm new password
                </FieldLabel>

                <InputShell
                  icon={
                    <ShieldCheck
                      size={18}
                    />
                  }
                >
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Repeat new password"
                    className="auth-input"
                  />
                </InputShell>

                <SubmitButton
                  loading={isLoading}
                >
                  Change password
                </SubmitButton>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// ==========================================
// FIELD LABEL
// ==========================================

function FieldLabel({ children }) {
  return (
    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#A3A3A3]">
      {children}
    </label>
  );
}

// ==========================================
// INPUT SHELL
// ==========================================

function InputShell({
  icon,
  children,
}) {
  return (
    <div className="relative mt-2 border border-[#303030] bg-[#0B0B0B] focus-within:border-[#E85D2A]">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E85D2A]">
        {icon}
      </span>

      {children}
    </div>
  );
}

// ==========================================
// SUBMIT BUTTON
// ==========================================

function SubmitButton({
  loading,
  children,
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-3 flex w-full items-center justify-center gap-3 bg-[#E85D2A] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-[#C9471B] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading && (
        <Loader2
          size={17}
          className="animate-spin"
        />
      )}

      {children}
    </button>
  );
}

// ==========================================
// BACK BUTTON
// ==========================================

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#777] hover:text-white"
    >
      <ArrowLeft size={15} />

      Back to sign in
    </button>
  );
}

// ==========================================
// MESSAGE
// ==========================================

function Message({ type, text }) {
  const isError = type === "error";

  return (
    <div
      className={`mb-6 flex items-start gap-3 border p-4 text-sm leading-6 ${
        isError
          ? "border-red-500/30 bg-red-500/10 text-red-300"
          : "border-[#E85D2A]/30 bg-[#E85D2A]/10 text-[#F2A181]"
      }`}
    >
      {isError ? (
        <AlertCircle
          size={18}
          className="mt-0.5 shrink-0"
        />
      ) : (
        <CheckCircle2
          size={18}
          className="mt-0.5 shrink-0"
        />
      )}

      <span>{text}</span>
    </div>
  );
}