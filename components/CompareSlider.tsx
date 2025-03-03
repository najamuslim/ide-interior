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
    <ReactCompareSlider
      itemOne={<ReactCompareSliderImage src={original} alt="original photo" />}
      itemTwo={<ReactCompareSliderImage src={restored} alt="generated photo" />}
      portrait={portrait}
      className="flex w-[600px] mt-5 h-96"
    />
  );
};
