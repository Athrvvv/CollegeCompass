"use client"

import { useActionState } from "react"
import { signUpWithEmail } from "./actions"

import AuthCard from "@/components/auth/AuthCard"
import AuthInput from "@/components/auth/AuthInput"
import PasswordInput from "@/components/auth/PasswordInput"
import AuthButton from "@/components/auth/AuthButton"
import AuthSwitch from "@/components/auth/AuthSwitch"

export default function SignupPage() {
  const [state, action, pending] = useActionState(signUpWithEmail, null)

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-200">

      <form action={action}>
        <AuthCard>

          <h1 className="text-2xl text-gray-700 font-semibold mb-6 text-center">
            Create your account
          </h1>

          {state?.error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm text-center">
              {state.error}
            </div>
          )}

          <AuthInput
            type="text"
            name="name"
            placeholder="Full Name"
            required
          />

          <AuthInput
            type="email"
            name="email"
            placeholder="Email"
            required
          />

          <PasswordInput
            name="password"
            placeholder="Password"
            required
          />

          <AuthButton type="submit">
            Sign Up
          </AuthButton>

          <AuthSwitch
            label="Already have an account?"
            linkText="Login"
            linkHref="/auth/sign-in"
          />

        </AuthCard>
      </form>

    </div>
  )
}