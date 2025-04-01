import Lottie from "lottie-react";

import Animation from "../../assets/loading.json";
import { useLoading } from "../../loadingContext/LoadingProvider";

const LottieAnimation = () => {
  const { isLoading } = useLoading();
  if (!isLoading) return null;
  return (
    <div className="h-full w-full absolute inset-0 flex justify-center items-center backdrop-blur-[5px] border-2 border-green-600">
      <div className="">
        <Lottie
          autoplay
          loop
          animationData={Animation}
          className="h-[200px] w-[200px] "
        />
        <p className="text-2xl text-[#0f4b91] text-center font-semibold tracking-widest -mt-7">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LottieAnimation;
