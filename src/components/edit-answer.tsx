import type { Answer } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "./ui/button";

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
      setText("");
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

  return (
    <li className="flex gap-2 py-1">
      <label>
        Answer:
        <input
          type="text"
          className="mx-4 border border-slate-500"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </label>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            if (!answer) {
              addAnswer.mutate({ text, questionId });
              return;
            }

            updateText.mutate({ id: answer.id, text });
          }}
        >
          {answer ? "Update" : "Add"}
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
