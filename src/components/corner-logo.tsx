import Image from "next/image";
import { trpc } from "../utils/trpc";

const CornerLogo = () => {
  const { data } = trpc.user.getUserBySession.useQuery();

  switch (data?.image) {
    case "kiralyhalmi":
      return (
        <Image
          src="/kiralyhalmi_logo.png"
          alt="caring medical logo"
          width={200}
          height={141}
          priority={true}
        />
      );
    default:
      return null;
  }
};

export default CornerLogo;
