import { BeatLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <BeatLoader color="rgb(14, 164, 166)" size={36} />
    </div>
  );
};

export default Spinner;
