"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const { data: session } = authClient.useSession();

  const router = useRouter();

  if (!session) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h1>Logged in as { session.user.name }</h1>
      <Button
        onClick={() => authClient.signOut({
          fetchOptions: {
            onSuccess: () => router.push("/sign-in"),
          }
        })}
      >
        Sign out
      </Button>
    </div>
  );
};
