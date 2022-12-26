import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const SignIn: NextPage = () => {
  return (
    <main>
      <AuthShowcase />
    </main>
  );
};

export default SignIn;

const AuthShowcase: React.FC = () => {
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
      <button
        className="rounded-full bg-blue-500/10 px-10 py-3 font-semibold text-blue-600 no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
