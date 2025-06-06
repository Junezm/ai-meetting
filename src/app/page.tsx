"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { date } from "drizzle-orm/singlestore-core";

export default function Home() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onSumit = () => {
    authClient.signUp.email(
      {
        email,
        name,
        password,
      },
      {
        onRequest: (ctx) => {
          //show loading
          alert(ctx);
        },
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          alert("onSuccess");
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      }
    );
  };

  const onLogin = () => {
    authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: (ctx) => {
          //show loading
          alert(ctx);
        },
        onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          alert("onSuccess");
        },
        onError: (ctx) => {
          // display the error message
          alert(ctx.error.message);
        },
      }
    );
  };
  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        logined with {session.user.name}
        <Button
          onClick={() => {
            authClient.signOut({
              onSuccess: () => {
                // Optionally, you can reload or redirect
                window.location.reload();
              },
              onError: (ctx) => {
                alert(ctx.error.message);
              },
            });
          }}
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 flex flex-col gap-y-4">
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <Input
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <Button onClick={onSumit}>create user</Button>
      </div>
      <div className="p-4 flex flex-col gap-y-4">
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <Input
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <Button onClick={onLogin}>login</Button>
      </div>
    </div>
  );
}
