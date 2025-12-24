import Lottie from "react-lottie";
import loadingJson from "./Animation - 1744556206739.json";

type Props = {
  height?: number | string;
};

export const FailureLottie = ({ height }: Props) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingJson,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Lottie
        options={defaultOptions}
        height={height}
        style={{ background: "#fff" }}
      />
    </div>
  );
};
