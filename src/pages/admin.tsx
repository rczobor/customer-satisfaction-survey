import { PlusIcon } from "lucide-react";
import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import EditQuestion from "../components/edit-question";
import Spinner from "../components/spinner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { trpc } from "../utils/trpc";

const Admin: NextPage = () => {
  const { status } = useSession();
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState(["", ""]);
  const { data, refetch } = trpc.question.getAll.useQuery();
  const addWithAnswersMutation = trpc.question.addWithAnswers.useMutation({
    onSuccess: () => {
      refetch();
      setQuestionText("");
      setAnswers(["", ""]);
    },
  });
  const { data: sessionData } = useSession();
  // const deleteAllPersonsMutation = trpc.person.deleteAll.useMutation();

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "unauthenticated") {
    return <div>Access denied</div>;
  }

  return (
    <div className="flex flex-col p-8">
      <div className="flex justify-end gap-4 pb-4">
        {/* <Button
          onClick={() => deleteAllPersonsMutation.mutate()}
          variant="destructive"
        >
          Delete All Answers
        </Button> */}

        <div className="flex w-fit flex-col items-center gap-4">
          <div>Logged in as {sessionData?.user?.email}</div>
          <Button variant="outline" onClick={() => signOut()}>
            Kijelentkezés
          </Button>
        </div>
      </div>

      <ul>
        {data?.map((question) => (
          <EditQuestion
            question={question}
            isLast={data.length - 1 === question.index}
            refetch={refetch}
            key={question.id}
          />
        ))}
      </ul>

      <div className="flex w-fit flex-col gap-2">
        <fieldset className="flex">
          <Label>Kérdés szöveg</Label>
          <Input
            type="text"
            value={questionText}
            onChange={(e) => {
              setQuestionText(e.target.value);
            }}
          />
        </fieldset>

        {answers.map((answer, index) => (
          <div key={index} className="flex items-center gap-2 text-center">
            <Label htmlFor={`answer-text-input-${index}`}>
              {index + 1}# Válasz szöveg
            </Label>
            <Input
              id={`answer-text-input-${index}`}
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
          </div>
        ))}

        <div className="flex gap-2">
          <Button
            onClick={() => {
              setAnswers([...answers, ""]);
            }}
          >
            <PlusIcon />
          </Button>

          <Button
            disabled={addWithAnswersMutation.isLoading || questionText === ""}
            onClick={() => {
              addWithAnswersMutation.mutate({
                text: questionText,
                answers: answers.filter((answer) => answer !== ""),
              });
            }}
          >
            Mentés
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
