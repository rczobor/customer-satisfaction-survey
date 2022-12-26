import type { NextPage } from "next";
import { useRouter } from "next/router";

const Question: NextPage = () => {
  const router = useRouter();

  if (typeof window !== "undefined") {
    router.replace("/question/1");
  }

  return <div>Loading...</div>;
};

export default Question;
