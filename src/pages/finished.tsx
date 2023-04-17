import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Finished = () => {
  const { push } = useRouter();
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((currentTimeLeft) => currentTimeLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft <= 0) {
    push("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-around p-6 text-center text-5xl text-primary">
      <h1 className="font-semibold">A válaszait rögzítettük.</h1>
      <h2 className="font-semibold">
        Köszönjük, hogy kitöltötte kérdőívünket!
      </h2>
      <Image
        src="/5-modified.png"
        alt="Köszönjük, hogy kitöltötte kérdőívünket!"
        width={125}
        height={125}
      />
      <p>A kérdőív újraindul {timeLeft} másopercen belül.</p>
    </div>
  );
};

export default Finished;
