import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

type SignUpForm = {
  email: string;
  password: string;
  secret: string;
};

const SignUp = () => {
  const { register, handleSubmit } = useForm<SignUpForm>();
  const onSubmit = (data: SignUpForm) => {
    signUp.mutate(data);
  };
  const signUp = trpc.auth.signUp.useMutation();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: true })} />
      <input {...register("password", { required: true })} />
      <input {...register("secret", { required: true })} />
      <input type="submit" />
    </form>
  );
};

export default SignUp;
