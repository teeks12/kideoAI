import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "shadow-lg",
        },
      }}
      routing="path"
      path="/auth/sign-in"
      signUpUrl="/auth/sign-up"
    />
  );
}
