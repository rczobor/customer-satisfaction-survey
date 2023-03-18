import { Answer } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../utils/trpc";

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
    <li className="flex gap-2">
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

      <div>
        <button
          className="border border-slate-500 p-1"
          onClick={() => {
            if (!answer) {
              addAnswer.mutate({ text, questionId });
              return;
            }

            updateText.mutate({ id: answer.id, text });
          }}
        >
          {answer ? "Update" : "Add"}
        </button>

        {answer && (
          <>
            <button
              className="border border-slate-500 p-1"
              onClick={() =>
                updateIsActive.mutate({
                  id: answer.id,
                  isActive: !answer.isActive,
                })
              }
            >
              {answer.isActive ? "Deactivate" : "Activate"}
            </button>

            <button
              className="border border-slate-500 p-1"
              onClick={() => deleteMutation.mutate({ id: answer.id })}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default EditAnswer;
