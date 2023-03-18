import type { Answer } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const EditAnswer = ({
  answer,
  questionId,
  refetch,
}: {
  answer?: Answer;
  questionId: string;
  refetch: () => void;
}) => {
  const [text, setText] = useState(answer?.text ?? "");
  const addAnswer = trpc.answer.add.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const updateText = trpc.answer.updateText.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const updateIsActive = trpc.answer.updateIsActive.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const deleteMutation = trpc.answer.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (!answer) {
    return (
      <li className="flex gap-2 py-1">
        <Button
          onClick={() => {
            addAnswer.mutate({ questionId });
          }}
        >
          Add
        </Button>
      </li>
    );
  }

  return (
    <li className="flex gap-2 py-1">
      <fieldset className="flex items-center gap-2 text-center">
        <Label htmlFor={`answer-text-input-${answer.id}`}>
          {answer.index + 1}# Answer
        </Label>
        <Input
          id={`answer-text-input-${answer.id}`}
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </fieldset>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            updateText.mutate({ id: answer.id, text });
          }}
        >
          Update
        </Button>

        {answer && (
          <>
            <Button
              onClick={() =>
                updateIsActive.mutate({
                  id: answer.id,
                  isActive: !answer.isActive,
                })
              }
            >
              {answer.isActive ? "Deactivate" : "Activate"}
            </Button>

            <Button onClick={() => deleteMutation.mutate({ id: answer.id })}>
              Delete
            </Button>
          </>
        )}
      </div>
    </li>
  );
};

export default EditAnswer;
