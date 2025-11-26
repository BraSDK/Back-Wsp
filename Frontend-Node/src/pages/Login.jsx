import { LoginForm } from "@/components/login-form"

export default function Login() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
