import type { NextPage } from "next";
import { useState } from "react";
import Question from "../../components/question";
import { trpc } from "../../utils/trpc";

const Questions: NextPage = () => {
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([""]);
  const { data, refetch } = trpc.question.getAll.useQuery();

  const addWithAnswersMutation = trpc.question.addWithAnswers.useMutation({
    onSuccess: () => {
      refetch();
      setQuestionText("");
      setAnswers([""]);
    },
  });

  return (
    <div className="flex flex-col p-4">
      <h1>Questions</h1>

      <ul>
        {data?.map((question) => (
          <Question question={question} refetch={refetch} key={question.id} />
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <div>
          <label>
            <span>Text of question</span>
            <input
              className="mx-4 border border-slate-500"
              type="text"
              value={questionText}
              onChange={(e) => {
                setQuestionText(e.target.value);
              }}
            />
          </label>
          <button
            className="border border-slate-500 p-1"
            disabled={addWithAnswersMutation.isLoading || questionText === ""}
            onClick={() => {
              addWithAnswersMutation.mutate({
                text: questionText,
                answers: answers.filter((answer) => answer !== ""),
              });
            }}
          >
            Add question
          </button>
        </div>

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
            disabled={addWithAnswersMutation.isLoading || questionText === ""}
            onClick={() => {
              addWithAnswersMutation.mutate({
                text: questionText,
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
