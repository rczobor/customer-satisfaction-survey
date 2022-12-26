import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const NthQuestion: NextPage = () => {
  const router = useRouter();
  const { index } = router.query;
  const parsedIndex = Number(index);
  const { data, isLoading, error } = trpc.question.getByIndex.useQuery(
    { index: parsedIndex },
    { enabled: typeof index === "string" }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className="flex flex-col">
      <h1>{data?.result?.text}</h1>

      <div className="flex justify-center gap-6">
        {data?.result?.answers.map((answer) => (
          <div key={answer.id}>
            <button className="rounded-md border-2 border-blue-600 p-2 text-lg font-semibold text-blue-600">
              {answer.text}
            </button>
          </div>
        ))}
      </div>

      <div>
        <button
          disabled={parsedIndex === 1}
          onClick={() => router.push(`/question/${parsedIndex - 1}`)}
        >
          Previous
        </button>

        <button
          disabled={!data.nextIndex}
          onClick={() => router.push(`/question/${parsedIndex + 1}`)}
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default NthQuestion;
