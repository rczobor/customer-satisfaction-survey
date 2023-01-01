import type { Answer as TAnswer } from "@prisma/client";
import { Question } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import Answer from "./answer";

const Question = ({
  question,
  refetch,
}: {
  question: Question & { answers: TAnswer[] };
  refetch: () => void;
}) => {
  const [questionText, setQuestionText] = useState(question.text);
  const updateText = trpc.question.updateText.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const updateIsActive = trpc.question.updateIsActive.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const deleteMutation = trpc.question.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <li className="my-2 flex flex-col gap-2  py-4">
      <div>
        <label>
          Question text:
          <input
            type="text"
            className="mx-4 border border-slate-500"
            value={questionText}
            onChange={(e) => {
              setQuestionText(e.target.value);
            }}
          />
        </label>

        <button
          className="border border-slate-500 p-1"
          onClick={() =>
            updateText.mutate({ id: question.id, text: questionText })
          }
        >
          Update
        </button>

        <button
          className="border border-slate-500 p-1"
          onClick={() =>
            updateIsActive.mutate({
              id: question.id,
              isActive: !question.isActive,
            })
          }
        >
          {question.isActive ? "Deactivate" : "Activate"}
        </button>

        <button
          className="border border-slate-500 p-1"
          onClick={() => deleteMutation.mutate({ id: question.id })}
        >
          Delete
        </button>
      </div>

      <ul>
        {question.answers.map((answer) => (
          <Answer
            answer={answer}
            questionId={question.id}
            refetch={refetch}
            key={answer.id}
          />
        ))}
        <Answer questionId={question.id} refetch={refetch} />
      </ul>
    </li>
  );
};

export default Question;
