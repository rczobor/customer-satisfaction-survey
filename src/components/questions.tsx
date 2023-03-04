import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

const TIMEOUT = 180;

const Questions = () => {
  const { push } = useRouter();
  const { data } = trpc.question.getAll.useQuery();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{
    [key: string]: { isInput: boolean; answer: string };
  }>({});
  const { mutate } = trpc.person.add.useMutation();
  const [timeLeft, setTimeLeft] = useState(TIMEOUT);

  const nextQuestion = useCallback(
    (questionId: string, isInput: boolean, answer: string) => {
      setIndex((prev) => prev + 1);
      setAnswers((prev) => ({
        ...prev,
        [questionId]: { isInput, answer },
      }));
    },
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((currentTimeLeft) => currentTimeLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && index !== 0) {
      setIndex(0);
    }
  }, [timeLeft, index]);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data.length === index) {
      mutate(answers);
    }
  }, [data, index, answers, mutate]);

  if (!data) {
    return <div>Loading...</div>;
  }

  if (data.length === index) {
    push("/finished");

    return <div>Finished</div>;
  }

  return (
    <>
      {index > 0 && (
        <div className="absolute flex w-full p-8">
          <button
            onClick={() => setIndex((current) => current - 1)}
            className="rounded-md border-4 border-primary px-4 py-2 text-3xl text-primary"
          >
            Vissza
          </button>
        </div>
      )}
      <NthQuestion question={data[index]} next={nextQuestion} />;
    </>
  );
};

export default Questions;

const NthQuestion = ({
  question,
  next,
}: {
  question:
    | Prisma.QuestionGetPayload<{ include: { answers: true } }>
    | undefined;
  next: (questionId: string, isInput: boolean, answer: string) => void;
}) => {
  const { register, handleSubmit } = useForm();

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="p-48" />
      <h1 className="px-4 text-center text-6xl font-bold text-primary">
        {question.text}
      </h1>
      {question.isInput && (
        <>
          <div className="p-48" />
          <form
            className="flex justify-center"
            onSubmit={handleSubmit((form) => {
              next(question.id, question.isInput, form.answer);
            })}
          >
            <input
              className="rounded-md border px-4 py-2 text-5xl font-semibold text-primary shadow-lg transition"
              type="text"
              {...register("answer", { required: true })}
              placeholder="Írd be a választ"
              autoComplete="off"
              autoFocus={true}
            />
            <input
              className="cursor-pointer rounded-md border bg-primary px-10 py-2 text-5xl font-semibold text-white shadow-lg transition hover:bg-white hover:text-primary"
              type="submit"
              value="Kész"
            />
          </form>
        </>
      )}
      {question.isSmiley ? (
        <>
          <div className="p-48" />
          <div className="flex justify-center gap-8">
            {question.answers.map((answer, index) => {
              return (
                <div key={answer.id} className="flex justify-center">
                  <button
                    onClick={() =>
                      next(question.id, question.isInput, answer.id)
                    }
                    className="w-full p-4"
                  >
                    <Image
                      src={`/${index + 1}-modified.png`}
                      alt={answer.text.toString()}
                      width={125}
                      height={125}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="p-24" />
          <div className="flex flex-col gap-20 px-48">
            {question.answers.map((answer) => {
              return (
                <div key={answer.id} className="flex justify-center">
                  <button
                    onClick={() =>
                      next(question.id, question.isInput, answer.id)
                    }
                    className="w-full bg-primary p-4 text-center text-5xl text-white"
                  >
                    {answer.text}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
