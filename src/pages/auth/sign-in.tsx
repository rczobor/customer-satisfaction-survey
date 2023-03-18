import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@radix-ui/react-label";
import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

type SignInForm = {
  email: string;
  password: string;
};

const SignIn: NextPage = () => {
  const { register, handleSubmit } = useForm<SignInForm>();
  const { data: sessionData } = useSession();
  const onSubmit = (data: SignInForm) => {
    signIn("credentials", { email: data.email, password: data.password });
  };

  if (sessionData) {
    return (
      <main className="flex justify-center pt-8">
        <div className="flex w-fit flex-col items-center gap-4">
          <div>Logged in as {sessionData.user?.email}</div>
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center pt-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-fit flex-col items-center gap-4"
      >
        <fieldset>
          <Label htmlFor="email-input">Email</Label>
          <Input
            id="email-input"
            type="email"
            {...register("email", { required: true })}
          />
        </fieldset>
        <fieldset>
          <Label htmlFor="pw-input">Password</Label>
          <Input
            id="pw-input"
            type="password"
            {...register("password", { required: true })}
          />
        </fieldset>
        <fieldset>
          <Button type="submit">Sign In</Button>
        </fieldset>
      </form>
    </main>
  );
};

export default SignIn;
