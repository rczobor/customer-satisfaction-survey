import Spinner from "@/src/components/spinner";
import { Label } from "@radix-ui/react-label";
import type { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { trpc } from "../../utils/trpc";

type SignUpForm = {
  email: string;
  password: string;
  secret: string;
};

const SignUp: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<SignUpForm>();
  const signUp = trpc.auth.signUp.useMutation();
  const onSubmit = (data: SignUpForm) => {
    setLoading(true);
    signUp.mutate(data);
    setLoading(false);
  };

  // TODO Add toast notification for errors and success

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="flex justify-center pt-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="just flex w-fit flex-col items-center gap-4"
      >
        <fieldset>
          <Label htmlFor="email-input">Email</Label>
          <Input id="email-input" {...register("email", { required: true })} />
        </fieldset>
        <fieldset>
          <Label htmlFor="pw-input">Password</Label>
          <Input id="pw-input" {...register("password", { required: true })} />
        </fieldset>
        <fieldset>
          <Label htmlFor="secret-input">Secret</Label>
          <Input
            id="secret-input"
            {...register("secret", { required: true })}
          />
        </fieldset>
        <fieldset>
          <Button type="submit">Sign Up</Button>
        </fieldset>
      </form>
    </main>
  );
};

export default SignUp;
