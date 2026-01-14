import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "shadow-lg",
        },
      }}
      routing="path"
      path="/auth/sign-up"
      signInUrl="/auth/sign-in"
      forceRedirectUrl="/onboarding"
      afterSignUpUrl="/onboarding"
    />
  );
}
