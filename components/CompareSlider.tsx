import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export const CompareSlider = ({
  original,
  restored,
  portrait = false,
}: {
  original: string;
  restored: string;
  portrait?: boolean;
}) => {
  return (
    <div className="relative">
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage src={original} alt="original photo" />
        }
        itemTwo={
          <ReactCompareSliderImage src={restored} alt="generated photo" />
        }
        portrait={portrait}
        className={`flex w-full ${
          portrait
            ? "sm:w-[220px] h-[300px] sm:h-[350px]"
            : "sm:w-[600px] h-48 sm:h-72"
        } mt-5`}
      />
    </div>
  );
};
