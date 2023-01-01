import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Finish = () => {
  const router = useRouter();
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev - 1);

      if (counter === 0) {
        router.push("/questions/1");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [counter, router]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-around p-6 text-center text-3xl font-semibold text-blue-600">
      <h1>A válaszait rögzítettük. Köszönjük, hogy kitöltötte kérdőívünket!</h1>
      <h1>A kérdőív újraindul {counter} másopercen belül.</h1>
    </div>
  );
};

export default Finish;
