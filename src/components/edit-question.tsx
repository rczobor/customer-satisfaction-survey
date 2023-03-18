import type { Answer, Question } from "@prisma/client";
import {
  ArrowDown,
  ArrowUp,
  Keyboard,
  List,
  Save,
  Smile,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import EditAnswer from "./edit-answer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const EditQuestion = ({
  question,
  isLast,
  refetch,
}: {
  question: Question & { answers: Answer[] };
  isLast: boolean;
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
  const updateIsDefault = trpc.question.updateIsDefault.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const makeInput = trpc.question.makeInput.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const makeSmiley = trpc.question.makeSmiley.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const deleteMutation = trpc.question.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const addAnswer = trpc.answer.add.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const moveUpByIndex = trpc.question.moveUpByIndex.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const moveDownByIndex = trpc.question.moveDownByIndex.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <li className="my-2 flex flex-col gap-2 py-4">
      <div className="flex gap-2">
        <fieldset className="flex items-center gap-2 text-center">
          <Label htmlFor={`question-text-input-${question.id}`}>
            {question.index + 1}# Question text
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
          <Save />
        </Button>

        <Button
          className={question.isActive ? "bg-green-500 hover:bg-green-600" : ""}
          variant={question.isActive ? "default" : "destructive"}
          onClick={() =>
            updateIsActive.mutate({
              id: question.id,
              isActive: !question.isActive,
            })
          }
        >
          {question.isActive ? "Active" : "Inactive"}
        </Button>

        <Button
          variant={
            !(question.isInput || question.isSmiley) ? "default" : "outline"
          }
          onClick={() =>
            updateIsDefault.mutate({
              id: question.id,
            })
          }
        >
          <List />
        </Button>

        <Button
          variant={question.isInput ? "default" : "outline"}
          onClick={() =>
            makeInput.mutate({
              id: question.id,
            })
          }
        >
          <Keyboard />
        </Button>

        <Button
          variant={question.isSmiley ? "default" : "outline"}
          onClick={() =>
            makeSmiley.mutate({
              id: question.id,
            })
          }
        >
          <Smile />
        </Button>

        <Button
          disabled={question.index === 0}
          onClick={() => {
            moveUpByIndex.mutate({
              id: question.id,
              index: question.index,
            });
          }}
        >
          <ArrowUp />
        </Button>

        <Button
          disabled={isLast}
          onClick={() => {
            moveDownByIndex.mutate({
              id: question.id,
              index: question.index,
            });
          }}
        >
          <ArrowDown />
        </Button>

        <Button
          variant="destructive"
          onClick={() =>
            deleteMutation.mutate({ id: question.id, index: question.index })
          }
        >
          <Trash2 />
        </Button>
      </div>

      {!(question.isInput || question.isSmiley) && (
        <ul>
          {question.answers.map((answer) => (
            <EditAnswer
              questionId={question.id}
              answer={answer}
              isLast={answer.index === question.answers.length - 1}
              refetch={refetch}
              key={answer.id}
            />
          ))}

          <li className="flex gap-2 py-1">
            <Button
              onClick={() => {
                addAnswer.mutate({ questionId: question.id });
              }}
            >
              Add
            </Button>
          </li>
        </ul>
      )}
    </li>
  );
};

export default EditQuestion;
