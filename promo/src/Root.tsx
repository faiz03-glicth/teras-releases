import { Composition } from "remotion";
import { TerasPromo } from "./Promo";

// Seven scenes at 30 fps: 75+120+135+135+120+105+90 frames, minus six 12-frame transitions = 708 (23.6 s).
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TerasPromo"
      component={TerasPromo}
      durationInFrames={708}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
