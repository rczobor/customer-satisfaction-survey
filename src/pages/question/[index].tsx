import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { trpc } from "../../utils/trpc";

const NthQuestion: NextPage = () => {
  const router = useRouter();
  const { index } = router.query;
  const parsedIndex = Number(index);
  const { register, handleSubmit } = useForm();
  const { data, isLoading, error } = trpc.question.getByIndex.useQuery(
    { index: parsedIndex },
    { enabled: typeof index === "string" }
  );
  const addMutation = trpc.record.add.useMutation({
    onMutate: () => {
      if (!data?.nextIndex) {
        router.push("/question/finish");
        return;
      }

      router.push(`/question/${parsedIndex + 1}`);
    },
  });
  const addInputAnswer = trpc.record.addInputAnswer.useMutation({
    onMutate: () => {
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
    <main className="relative flex min-h-screen flex-col items-center justify-between p-6">
      <div className=" w-full">
        <h1 className="text-center text-3xl font-semibold text-primary">
          {data?.result?.text}
        </h1>

        <button
          className="absolute top-0 right-0 h-16 w-16 cursor-default"
          onClick={() => {
            router.push("/edit-questions");
          }}
        ></button>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-4 py-6 px-2">
        {data.result?.isInput ? (
          <form
            onSubmit={handleSubmit((form) => {
              if (!data.result?.id) {
                return;
              }

              addInputAnswer.mutate({
                questionId: data.result.id,
                text: form.answer,
              });
            })}
          >
            <input
              className="rounded-md border bg-green-50 px-4 py-2 text-3xl font-semibold text-primary shadow-lg transition hover:bg-primary hover:text-white"
              type="text"
              {...register("answer", { required: true })}
              placeholder="Írd be a választ"
            />
            <input
              className="cursor-pointer rounded-md border bg-green-50 px-4 py-2 text-3xl font-semibold text-primary shadow-lg transition hover:bg-primary hover:text-white"
              type="submit"
              value="Kész"
            />
          </form>
        ) : (
          data?.result?.answers.map((answer) => (
            <div key={answer.id}>
              <button
                className="rounded-md border bg-green-50 px-6 py-2 text-3xl font-semibold text-primary shadow-lg transition hover:bg-primary hover:text-white"
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
          ))
        )}
      </div>

      <div className="flex w-full justify-between">
        <button
          className="cursor-pointer rounded-full border bg-green-50 px-10 py-3 font-semibold text-primary no-underline shadow-lg transition hover:bg-primary hover:text-white"
          disabled={parsedIndex === 1}
          onClick={() => router.push(`/question/${parsedIndex - 1}`)}
        >
          Vissza
        </button>

        <button
          className="cursor-pointer rounded-full border bg-green-50 px-10 py-3 font-semibold text-primary no-underline shadow-lg transition hover:bg-primary hover:text-white"
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
