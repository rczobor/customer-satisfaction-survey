import Image from "next/image";
import { trpc } from "../utils/trpc";

const Logo = () => {
  const { data } = trpc.user.getUserBySession.useQuery();

  switch (data?.image) {
    case "kiralyhalmi":
      return (
        <Image
          src="/kiralyhalmi_logo.png"
          alt="caring medical logo"
          width={750}
          height={530}
          priority={true}
        />
      );
    default:
      return (
        <Image
          src="/caringmedical_logo.png"
          alt="caring medical logo"
          width={750}
          height={215}
          priority={true}
        />
      );
  }
};

export default Logo;
