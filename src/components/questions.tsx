import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import Logo from "./logo";
import Spinner from "./spinner";
import { Button } from "./ui/button";

// Amount of seconds before the user is redirected to the first question
const TIMEOUT = 300;

const Questions = () => {
  const { push } = useRouter();
  const { data, isLoading } = trpc.question.getAll.useQuery();
  const [index, setIndex] = useState(-1);
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
      setTimeLeft(TIMEOUT);
    },
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (index >= 0) {
        setTimeLeft((currentTimeLeft) => currentTimeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [index]);

  useEffect(() => {
    if (timeLeft <= 0 && index >= 0) {
      setIndex(-1);
      setTimeLeft(TIMEOUT);
    }
  }, [timeLeft, index]);

  useEffect(() => {
    if (data?.length === index) {
      mutate(answers);
      push("/finished");
    }
  }, [data, index, answers, mutate, push]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!data) {
    return <div>Hiba</div>;
  }

  return (
    <>
      {index > 0 && (
        <div className="absolute flex w-full p-8">
          <Button
            onClick={() => setIndex((current) => current - 1)}
            className="h-14 rounded-md border-4 border-primary px-4 py-2 text-3xl text-primary"
            variant="outline"
          >
            Vissza
          </Button>
        </div>
      )}
      {index === -1 ? (
        <div
          className="flex min-h-screen cursor-pointer flex-col items-center justify-evenly p-6 "
          onClick={() => setIndex(0)}
        >
          <Logo />
          <h2 className="text-center text-6xl font-bold text-primary">
            A kérdőív kitöltéséhez érintse meg a képernyőt!
          </h2>
        </div>
      ) : (
        <NthQuestion question={data[index]} next={nextQuestion} />
      )}
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
    <div className="flex min-h-screen flex-col justify-evenly">
      <h1 className="px-4 text-center text-6xl font-bold text-primary">
        {question.text}
      </h1>
      {question.isInput && (
        <form
          className="flex justify-center"
          onSubmit={handleSubmit((form) => {
            next(question.id, question.isInput, form.answer);
          })}
        >
          <input
            className="rounded-md border px-4 py-2 text-5xl font-semibold text-primary shadow-lg outline-none ring-primary transition focus-visible:ring-2"
            type="text"
            {...register("answer", { required: true })}
            placeholder="Írja be a választ"
            autoComplete="off"
            autoFocus={true}
          />
          <input
            className="cursor-pointer rounded-md border bg-primary px-10 py-2 text-5xl font-semibold text-white shadow-lg transition hover:bg-white hover:text-primary"
            type="submit"
            value="Kész"
          />
        </form>
      )}
      {question.isSmiley ? (
        <div className="flex justify-center gap-8">
          {question.answers.map((answer, index) => {
            return (
              <div key={answer.id} className="flex justify-center">
                <button
                  onClick={() => next(question.id, question.isInput, answer.id)}
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
      ) : (
        <div className="flex flex-col gap-20 px-48">
          {question.answers.map((answer) => {
            return (
              <div key={answer.id} className="flex justify-center">
                <button
                  onClick={() => next(question.id, question.isInput, answer.id)}
                  className="w-full bg-primary p-4 text-center text-5xl text-white"
                >
                  {answer.text}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
