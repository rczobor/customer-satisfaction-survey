import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../components/ui/button";
import { trpc } from "../utils/trpc";

const SignIn: NextPage = () => {
  return (
    <main>
      <AuthShowcase />
    </main>
  );
};

export default SignIn;

const AuthShowcase = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.email}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <Button onClick={sessionData ? () => signOut() : () => signIn()}>
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
};
