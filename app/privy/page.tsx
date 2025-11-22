"use client";

import { usePrivy } from "@privy-io/react-auth";

export default function LoginPage() {
  const { ready, login, authenticated, user } = usePrivy();

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (authenticated) {
    return (
      <div>
        Welcome {user?.id}! {/* maybe redirect */}
      </div>
    );
  }

  return <button onClick={() => login()}>Log in / Sign up</button>;
}
