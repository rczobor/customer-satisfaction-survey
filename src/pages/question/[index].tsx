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
  const addMutation = trpc.record.add.useMutation({
    onSuccess: () => {
      if (!data?.nextIndex) {
        router.push("/question/finish");
        return;
      }

      router.push(`/question/${parsedIndex + 1}`);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6">
      <h1 className="text-3xl font-semibold text-blue-600">
        {data?.result?.text}
      </h1>

      <div className="flex w-full flex-wrap justify-evenly gap-2 py-6">
        {data?.result?.answers.map((answer) => (
          <div key={answer.id}>
            <button
              className="rounded-md bg-blue-600/10 px-4 py-2 text-3xl font-semibold text-blue-600"
              onClick={() => {
                addMutation.mutate({
                  answerId: answer.id,
                  questionId: answer.questionId,
                });
              }}
            >
              {answer.text}
            </button>
          </div>
        ))}
      </div>

      <div className="flex w-full justify-between">
        <button
          className="rounded-full bg-blue-500/10 px-10 py-3 font-semibold text-blue-600 no-underline transition hover:bg-white/20"
          disabled={parsedIndex === 1}
          onClick={() => router.push(`/question/${parsedIndex - 1}`)}
        >
          Vissza
        </button>

        <button
          className="rounded-full bg-blue-500/10 px-10 py-3 font-semibold text-blue-600 no-underline transition hover:bg-white/20"
          disabled={!data.nextIndex}
          onClick={() => router.push(`/question/${parsedIndex + 1}`)}
        >
          Kihagyás
        </button>
      </div>
    </main>
  );
};

export default NthQuestion;
