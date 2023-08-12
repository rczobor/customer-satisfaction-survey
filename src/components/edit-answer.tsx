import type { Answer } from "@prisma/client";
import { ArrowDown, ArrowUp, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const EditAnswer = ({
  questionId,
  answer,
  isLast,
  refetch,
}: {
  questionId: string;
  answer: Answer;
  isLast: boolean;
  refetch: () => void;
}) => {
  const [text, setText] = useState(answer?.text ?? "");
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
  const moveUpByIndex = trpc.answer.moveUpByIndex.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const moveDownByIndex = trpc.answer.moveDownByIndex.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <li className="flex gap-2 py-1">
      <fieldset className="flex items-center gap-2 text-center">
        <Label htmlFor={`answer-text-input-${answer.id}`}>
          {answer.index + 1}# Válasz szöveg
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
          <Save />
        </Button>

        {answer && (
          <>
            <Button
              className={
                answer.isActive ? "bg-green-500 hover:bg-green-600" : ""
              }
              variant={answer.isActive ? "default" : "destructive"}
              onClick={() =>
                updateIsActive.mutate({
                  id: answer.id,
                  isActive: !answer.isActive,
                })
              }
            >
              {answer.isActive ? "Aktív" : "Inaktív"}
            </Button>

            <Button
              disabled={answer.index === 0}
              onClick={() => {
                moveUpByIndex.mutate({
                  questionId,
                  id: answer.id,
                  index: answer.index,
                });
              }}
            >
              <ArrowUp />
            </Button>

            <Button
              disabled={isLast}
              onClick={() => {
                moveDownByIndex.mutate({
                  questionId,
                  id: answer.id,
                  index: answer.index,
                });
              }}
            >
              <ArrowDown />
            </Button>

            <Button
              variant="destructive"
              onClick={() =>
                deleteMutation.mutate({ id: answer.id, index: answer.index })
              }
            >
              <Trash2 />
            </Button>
          </>
        )}
      </div>
    </li>
  );
};

export default EditAnswer;
