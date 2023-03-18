import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import EditQuestion from "../components/edit-question";
import { trpc } from "../utils/trpc";

const Admin: NextPage = () => {
  const { status } = useSession();
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
  // const deleteAllPersonsMutation = trpc.person.deleteAll.useMutation();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Access denied</div>;
  }

  return (
    <div className="flex flex-col p-4">
      {/* DELETE ALL RECORDS */}
      {/* <div>
        <button
          className="border border-slate-500 bg-red-400 p-1"
          onClick={() => deleteAllPersonsMutation.mutate()}
        >
          Delete All Persons
        </button>
      </div> */}

      <h1>Questions</h1>

      <ul>
        {data?.map((question) => (
          <EditQuestion
            question={question}
            refetch={refetch}
            key={question.id}
          />
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

export default Admin;
