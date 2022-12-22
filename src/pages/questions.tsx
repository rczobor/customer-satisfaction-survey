import type { NextPage } from "next";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const Questions: NextPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [answers, setAnswers] = useState([""]);
  const questions = trpc.question.getAll.useQuery();
  const deleteMutation = trpc.question.delete.useMutation({
    onSuccess: () => {
      questions.refetch();
    },
  });
  const addWithAnswersMutation = trpc.question.addWithAnswers.useMutation({
    onSuccess: () => {
      questions.refetch();
    },
  });

  return (
    <div className="flex flex-col p-4">
      <h1>Questions</h1>

      <ul>
        {questions.data?.map((question) => (
          <li className="flex gap-2" key={question.id}>
            <span>Question text: {question.text}</span>
            <ul>
              {question.answers.map((answer) => (
                <li key={answer.id}>Answer: {answer.text}</li>
              ))}
            </ul>

            <div>
              <button
                className="border border-slate-500 p-1"
                onClick={() => deleteMutation.mutate({ id: question.id })}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <label>
          <span>Text of question</span>
          <input
            className="mx-4 border border-slate-500"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        </label>

        {answers.map((answer, index) => (
          <div key={index}>
            <label>
              <span>{index + 1}# answer</span>
              <input
                className="mx-4 border border-slate-500"
                type="text"
                value={answer}
                onChange={(e) => {
                  setAnswers((prev) => {
                    const copy = [...prev];
                    copy[index] = e.target.value;
                    return copy;
                  });
                }}
              />
            </label>

            {index === answers.length - 1 && (
              <button
                className="border border-slate-500 p-1"
                onClick={() => {
                  setAnswers([...answers, ""]);
                }}
              >
                Add answer
              </button>
            )}
          </div>
        ))}

        <div>
          <button
            className="border border-slate-500 p-1"
            disabled={addWithAnswersMutation.isLoading || inputValue === ""}
            onClick={() => {
              addWithAnswersMutation.mutate({
                text: inputValue,
                answers: answers.filter((answer) => answer !== ""),
              });
            }}
          >
            Add question
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questions;
