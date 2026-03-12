'use client';

import { useActionState } from 'react';
import { signInWithEmail } from "./actions"
import Link from "next/link"

import AuthCard from "@/components/auth/AuthCard"
import AuthInput from "@/components/auth/AuthInput"
import PasswordInput from "@/components/auth/PasswordInput"
import AuthButton from "@/components/auth/AuthButton"
import AuthSwitch from "@/components/auth/AuthSwitch"

export default function LoginPage() {
  const [state, action, isPending] = useActionState(signInWithEmail, null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-200">

      {/* Back to Landing */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-black transition"
      >
        ← Back
      </Link>

      <form action={action}>
        <AuthCard>

          <h1 className="text-2xl text-gray-700 font-semibold mb-6 text-center">
            Login to CollegeCompass
          </h1>

          <AuthInput
            type="email"
            name="email"
            placeholder="Email"
            required
            disabled={isPending}
          />

          <PasswordInput
            name="password"
            placeholder="Password"
            required
            disabled={isPending}
          />

          {state?.error && (
            <p className="text-red-500 text-sm mb-4 text-center">{state.error}</p>
          )}

          <AuthButton type="submit" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </AuthButton>

          <AuthSwitch
            label="Don't have an account?"
            linkText="Sign up"
            linkHref="/auth/sign-up"
          />

        </AuthCard>
      </form>

    </div>
  )
}