import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Questions from "../components/questions";
import Spinner from "../components/spinner";

const Home: NextPage = () => {
  const { status } = useSession();
  const { replace } = useRouter();

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "unauthenticated") {
    replace("/auth/sign-in");
  }

  if (status === "authenticated") {
    return (
      <>
        <Head>
          <title>Caring Medical</title>
          <meta
            name="description"
            content="Caring Medical customer satisfaction survey"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <Questions />
        </main>
      </>
    );
  }

  return <div>Hiba</div>;
};

export default Home;
