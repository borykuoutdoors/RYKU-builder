import { redirect } from 'next/navigation'

// All sign-up flows are handled by the unified auth page
export default function SignupPage() {
  redirect('/login?mode=create')
}
