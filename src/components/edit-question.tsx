import type { Answer, Question } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import EditAnswer from "./edit-answer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const EditQuestion = ({
  question,
  refetch,
}: {
  question: Question & { answers: Answer[] };
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
  const updateIsInput = trpc.question.updateIsInput.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const updateIsSmiley = trpc.question.updateIsSmiley.useMutation({
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
    <li className="my-2 flex flex-col gap-2 py-4">
      <div className="flex gap-2">
        <fieldset className="flex items-center gap-2 text-center">
          <Label htmlFor={`question-text-input-${question.id}`}>
            Question text
          </Label>
          <Input
            id={`question-text-input-${question.id}`}
            type="text"
            value={questionText}
            onChange={(e) => {
              setQuestionText(e.target.value);
            }}
          />
        </fieldset>

        <Button
          onClick={() =>
            updateText.mutate({ id: question.id, text: questionText })
          }
        >
          Update
        </Button>

        <Button
          onClick={() =>
            updateIsActive.mutate({
              id: question.id,
              isActive: !question.isActive,
            })
          }
        >
          {question.isActive ? "Deactivate" : "Activate"}
        </Button>

        <Button
          onClick={() =>
            updateIsInput.mutate({
              id: question.id,
              isInput: !question.isInput,
            })
          }
        >
          {question.isInput ? "Selection" : "Input"}
        </Button>

        <Button
          onClick={() =>
            updateIsSmiley.mutate({
              id: question.id,
              isSmiley: !question.isSmiley,
            })
          }
        >
          {question.isSmiley ? "Regular" : "Smiley"}
        </Button>

        <Button onClick={() => deleteMutation.mutate({ id: question.id })}>
          Delete
        </Button>
      </div>

      {!question.isInput && (
        <ul>
          {question.answers.map((answer) => (
            <EditAnswer
              answer={answer}
              questionId={question.id}
              refetch={refetch}
              key={answer.id}
            />
          ))}
          <EditAnswer questionId={question.id} refetch={refetch} />
        </ul>
      )}
    </li>
  );
};

export default EditQuestion;
