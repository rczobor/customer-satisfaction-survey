import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { data } = trpc.user.getUserBySession.useQuery();

  if (typeof window !== "undefined" && data?.color) {
    const root = document.querySelector<HTMLElement>(":root");
    root?.style.setProperty("--primary", "50 21.5% 52.5%");
  }

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
