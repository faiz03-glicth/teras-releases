import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { loadFont } from "@remotion/google-fonts/Inter";
import { BODY_MUSCLES, BODY_OFFSET, BODY_OUTLINE, BODY_VIEWBOX } from "./body";

// Teras look: dark first, one gold for data and the one action, ivory for muscles hit.
// Every number on screen is a placeholder for the promo, not anyone's data.
const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const C = {
  ground: "#0B0B0B",
  card: "#1B1B1E",
  well: "#141416",
  key: "#2A2A2E",
  text: "#F4F4F4",
  text2: "#A1A1A1",
  gold: "#FFD179",
  goldDeep: "#9A6F20",
  onGold: "#2B1D0B",
  ivory: "#EFE4CC",
  body: "#2D2D2D",
  muscle: "#3B3B3F",
  barPast: "#3A3A3F",
} as const;

const SONGKET =
  "repeating-linear-gradient(90deg, #FFD179 0 18px, transparent 18px 26px, #9A6F20 26px 34px, transparent 34px 42px)";
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- shared pieces ----------

// A headline that rises in, then a supporting line a beat later.
const Headline: React.FC<{ title: string; sub: string }> = ({ title, sub }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 150 }}>
      <div
        style={{
          fontSize: 92,
          lineHeight: 1.05,
          fontWeight: 800,
          letterSpacing: -2,
          color: C.text,
          opacity: interpolate(frame, [0, 14], [0, 1], clamp),
          translate: `0 ${interpolate(frame, [0, 20], [40, 0], { ...clamp, easing: OUT })}px`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 46,
          lineHeight: 1.25,
          fontWeight: 500,
          color: C.text2,
          marginTop: 22,
          opacity: interpolate(frame, [8, 24], [0, 1], clamp),
          translate: `0 ${interpolate(frame, [8, 28], [30, 0], { ...clamp, easing: OUT })}px`,
        }}
      >
        {sub}
      </div>
    </div>
  );
};

// A card that springs up from below and settles with a slow drift, so the frame never sits still.
const Card: React.FC<{
  top: number;
  delay?: number;
  height?: number;
  children: React.ReactNode;
}> = ({ top, delay = 6, height, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        right: 64,
        top,
        height,
        padding: 44,
        boxSizing: "border-box",
        borderRadius: 48,
        background: C.card,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 80px rgba(0,0,0,0.55)",
        opacity: enter,
        translate: `0 ${interpolate(enter, [0, 1], [140, 0]) - frame * 0.15}px`,
      }}
    >
      {children}
    </div>
  );
};

// A finger-tip that presses: grows in, presses down, and leaves a ring.
const Tap: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < -8 || t > 22) return null;
  const press = interpolate(t, [-8, 0, 4, 10], [0, 1, 0.82, 1], clamp);
  const ring = interpolate(t, [0, 18], [0, 1], clamp);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 70,
          top: y - 70,
          width: 140,
          height: 140,
          borderRadius: 70,
          border: `4px solid ${C.ivory}`,
          opacity: interpolate(ring, [0, 1], [0.7, 0]),
          scale: interpolate(ring, [0, 1], [0.4, 1.3]),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 34,
          top: y - 34,
          width: 68,
          height: 68,
          borderRadius: 34,
          background: "rgba(239,228,204,0.55)",
          opacity: interpolate(t, [-8, 0, 14, 22], [0, 1, 1, 0], clamp),
          scale: press,
        }}
      />
    </>
  );
};

// The body: outline, muscles at rest, then each muscle lit by its own schedule (once = half ivory, twice = full).
type Light = { muscle: string; once: number; twice?: number };
const Body: React.FC<{ lights: readonly Light[]; height: number }> = ({
  lights,
  height,
}) => {
  const frame = useCurrentFrame();
  const [, , vw, vh] = BODY_VIEWBOX.split(" ").map(Number);
  const level = (m: string) => {
    const l = lights.find((x) => x.muscle === m);
    if (!l) return 0;
    const a = interpolate(frame, [l.once, l.once + 10], [0, 0.5], clamp);
    const b =
      l.twice === undefined
        ? 0
        : interpolate(frame, [l.twice, l.twice + 10], [0, 0.5], clamp);
    return a + b;
  };
  return (
    <svg width={(height * vw) / vh} height={height} viewBox={BODY_VIEWBOX}>
      <g transform={`translate(${BODY_OFFSET.x} ${BODY_OFFSET.y})`}>
        {BODY_OUTLINE.map((d, i) => (
          <path key={`b${i}`} d={d} fill={C.body} opacity={0.6} />
        ))}
        {Object.entries(BODY_MUSCLES).map(([m, ps]) =>
          ps.map((d, i) => (
            <g key={`${m}${i}`}>
              <path d={d} fill={C.muscle} opacity={0.4} />
              <path d={d} fill={C.ivory} opacity={level(m)} />
            </g>
          )),
        )}
      </g>
    </svg>
  );
};

// ---------- scenes ----------

const Intro: React.FC<{ line: string }> = ({ line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const letters = "Teras".split("");
  return (
    <AbsoluteFill
      style={{
        background: C.ground,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 230,
          fontWeight: 800,
          letterSpacing: -8,
          color: C.gold,
        }}
      >
        {letters.map((ch, i) => {
          const s = spring({
            frame: frame - i * 4,
            fps,
            config: { damping: 14, mass: 0.6 },
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: s,
                translate: `0 ${interpolate(s, [0, 1], [120, 0])}px`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 36,
          height: 18,
          borderRadius: 9,
          background: SONGKET,
          width: interpolate(frame, [12, 40], [0, 420], {
            ...clamp,
            easing: OUT,
          }),
        }}
      />
      <div
        style={{
          marginTop: 48,
          fontSize: 52,
          fontWeight: 600,
          color: C.text,
          opacity: interpolate(frame, [30, 46], [0, 1], clamp),
          translate: `0 ${interpolate(frame, [30, 50], [24, 0], { ...clamp, easing: OUT })}px`,
        }}
      >
        {line}
      </div>
    </AbsoluteFill>
  );
};

// The training wave: half a year of weeks grows in, left to right; this week glows gold.
const WAVE = [
  2, 3, 3, 1, 4, 3, 2, 4, 4, 3, 5, 4, 2, 3, 4, 5, 4, 3, 5, 5, 4, 3, 5, 4, 5, 4,
];
const Wave: React.FC = () => {
  const frame = useCurrentFrame();
  const count = Math.round(interpolate(frame, [30, 80], [0, 4], clamp));
  return (
    <AbsoluteFill style={{ background: C.ground, fontFamily }}>
      <Headline
        title="Your week, one wave."
        sub="Every session you log lifts it."
      />
      <Card top={560} height={760}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 700, color: C.text }}>
            Last 6 months
          </div>
          <div style={{ fontSize: 40, fontWeight: 600, color: C.gold }}>
            {count} this week
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            height: 460,
            marginTop: 70,
          }}
        >
          {WAVE.map((h, i) => {
            const grow = interpolate(frame, [14 + i * 2, 30 + i * 2], [0, 1], {
              ...clamp,
              easing: OUT,
            });
            const last = i === WAVE.length - 1;
            const glow = last ? 0.5 + 0.5 * Math.sin(frame / 6) : 0;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: h * 82 * grow,
                  borderRadius: 10,
                  background: last ? C.gold : h >= 4 ? "#6A6A70" : C.barPast,
                  boxShadow: last
                    ? `0 0 ${30 + glow * 30}px rgba(255,209,121,${0.35 + glow * 0.3})`
                    : "none",
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 26,
            fontSize: 30,
            color: C.text2,
          }}
        >
          <span>May</span>
          <span>This week</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// Logging: a finger ticks each set; the tick turns gold and the rest timer starts counting down.
const SETS = [
  { kg: "80", reps: "8" },
  { kg: "82.5", reps: "6" },
  { kg: "82.5", reps: "6" },
  { kg: "85", reps: "5" },
];
const TICK_AT = [30, 52, 74, 96];
const Log: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lastTick = TICK_AT.filter((t) => frame >= t).pop();
  const rest =
    lastTick === undefined
      ? 90
      : Math.max(0, 90 - Math.floor((frame - lastTick) / fps));
  return (
    <AbsoluteFill style={{ background: C.ground, fontFamily }}>
      <Headline
        title="Log a set in one tap."
        sub="Weight, reps, rest. Nothing in the way."
      />
      <Card top={560} height={900}>
        <div style={{ fontSize: 52, fontWeight: 700, color: C.text }}>
          Barbell Bench Press
        </div>
        <div style={{ fontSize: 32, color: C.text2, marginTop: 8 }}>
          Last week: 80 kg × 8
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            marginTop: 44,
          }}
        >
          {SETS.map((s, i) => {
            const done = spring({
              frame: frame - TICK_AT[i],
              fps,
              config: { damping: 12, mass: 0.5 },
            });
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  height: 116,
                  padding: "0 28px",
                  borderRadius: 28,
                  background: C.well,
                  boxShadow:
                    done > 0.5
                      ? "inset 0 0 0 3px rgba(255,209,121,0.35)"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: 60,
                    fontSize: 40,
                    fontWeight: 700,
                    color: C.text2,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    flex: 1,
                    fontSize: 46,
                    fontWeight: 700,
                    color: C.text,
                  }}
                >
                  {s.kg} kg{" "}
                  <span style={{ color: C.text2, fontWeight: 500 }}>
                    × {s.reps}
                  </span>
                </div>
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: done > 0.5 ? C.gold : C.key,
                    scale: interpolate(done, [0, 0.5, 1], [1, 1.18, 1]),
                  }}
                >
                  <svg
                    width={44}
                    height={44}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={done > 0.5 ? C.onGold : "#6E6E74"}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 44,
            height: 110,
            borderRadius: 55,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            background: C.key,
            opacity: interpolate(
              frame,
              [TICK_AT[0], TICK_AT[0] + 10],
              [0, 1],
              clamp,
            ),
          }}
        >
          <span style={{ fontSize: 36, color: C.text2 }}>Rest</span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: C.text,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {Math.floor(rest / 60)}:{String(rest % 60).padStart(2, "0")}
          </span>
        </div>
      </Card>
      {TICK_AT.map((t, i) => (
        <Tap
          key={i}
          x={64 + 1080 - 128 - 44 - 28 - 42}
          y={560 + 44 + 52 + 8 + 32 + 44 + i * 136 + 58}
          at={t}
        />
      ))}
    </AbsoluteFill>
  );
};

// The muscle map: Push Day lights chest, shoulders and arms once, then the chest again for twice.
const Muscles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.ground, fontFamily }}>
      <Headline
        title="See which muscles you hit."
        sub="Once, twice, or still to go."
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 560,
          display: "flex",
          justifyContent: "center",
          scale: interpolate(frame, [0, 130], [0.96, 1.03]),
        }}
      >
        <Body
          height={1080}
          lights={[
            { muscle: "chest", once: 20, twice: 74 },
            { muscle: "shoulders", once: 32, twice: 86 },
            { muscle: "biceps", once: 44 },
            { muscle: "core", once: 56 },
          ]}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 120,
          display: "flex",
          justifyContent: "center",
          gap: 56,
          fontSize: 36,
          color: C.text2,
          opacity: interpolate(frame, [60, 76], [0, 1], clamp),
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: C.ivory,
              opacity: 0.5,
            }}
          />
          Hit once
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: C.ivory,
            }}
          />
          Hit twice
        </span>
      </div>
    </AbsoluteFill>
  );
};

// The chart: twelve weeks grow in; this week climbs past last week's line, and the gain counts up.
const WEEKS = [38, 45, 41, 52, 48, 55, 50, 58, 54, 61, 63, 0];
const Beat: React.FC = () => {
  const frame = useCurrentFrame();
  const now = interpolate(frame, [44, 92], [0, 70], { ...clamp, easing: OUT });
  const gain = Math.max(0, Math.round(((now - 63) / 63) * 100));
  const H = 7.4;
  return (
    <AbsoluteFill style={{ background: C.ground, fontFamily }}>
      <Headline
        title="Beat last week."
        sub="Twelve weeks of training, side by side."
      />
      <Card top={560} height={860}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 700, color: C.text }}>
            Duration
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: C.gold,
              opacity: interpolate(frame, [80, 92], [0, 1], clamp),
            }}
          >
            +{gain}% on last week
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-end",
            gap: 14,
            height: 560,
            marginTop: 70,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 63 * H,
              borderTop: `3px dashed ${C.text2}`,
              opacity: interpolate(frame, [30, 44], [0, 0.6], clamp),
            }}
          />
          {WEEKS.map((h, i) => {
            const last = i === WEEKS.length - 1;
            const grow = interpolate(frame, [6 + i * 2, 22 + i * 2], [0, 1], {
              ...clamp,
              easing: OUT,
            });
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: (last ? now : h * grow) * H,
                  borderRadius: 12,
                  background: last ? C.gold : C.barPast,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 26,
            fontSize: 30,
            color: C.text2,
          }}
        >
          <span>12 weeks ago</span>
          <span>This week</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// Sharing: the workout card lifts in, the body on it lights up, and Share is pressed.
const Share: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lift = spring({ frame: frame - 4, fps, config: { damping: 18 } });
  const press = interpolate(frame, [70, 74, 80], [1, 0.94, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.ground, fontFamily }}>
      <Headline
        title="Share what you lifted."
        sub="Your workout and your muscle map."
      />
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          top: 560,
          height: 900,
          borderRadius: 48,
          padding: 52,
          boxSizing: "border-box",
          background: "linear-gradient(160deg, #1F1A12 0%, #0F0E0C 100%)",
          boxShadow:
            "0 40px 100px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(255,209,121,0.18)",
          opacity: lift,
          translate: `0 ${interpolate(lift, [0, 1], [200, 0])}px`,
          rotate: `${interpolate(lift, [0, 1], [-6, 0])}deg`,
        }}
      >
        <div
          style={{
            height: 12,
            width: 200,
            borderRadius: 6,
            background: SONGKET,
          }}
        />
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: C.text,
            marginTop: 30,
          }}
        >
          Push Day
        </div>
        <div style={{ fontSize: 34, color: C.text2, marginTop: 8 }}>
          58 min · 6,420 kg · 18 sets
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 30 }}
        >
          <Body
            height={540}
            lights={[
              { muscle: "chest", once: 20, twice: 30 },
              { muscle: "shoulders", once: 26, twice: 36 },
              { muscle: "biceps", once: 32 },
            ]}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          top: 1520,
          height: 130,
          borderRadius: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 50,
          fontWeight: 700,
          color: C.onGold,
          background: C.gold,
          boxShadow: `inset 0 2px 0 rgba(255,255,255,0.6), 0 6px 0 ${C.goldDeep}`,
          opacity: interpolate(frame, [30, 44], [0, 1], clamp),
          scale: press,
        }}
      >
        Share
      </div>
      <Tap x={540} y={1585} at={72} />
    </AbsoluteFill>
  );
};

export const TerasPromo: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = linearTiming({ durationInFrames: Math.round(0.4 * fps) });
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence
        name="Intro"
        durationInFrames={Math.round(2.5 * fps)}
      >
        <Intro line="A training log for the gym floor." />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={t} />
      <TransitionSeries.Sequence name="Wave" durationInFrames={4 * fps}>
        <Wave />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={t}
      />
      <TransitionSeries.Sequence
        name="Log a set"
        durationInFrames={Math.round(4.5 * fps)}
      >
        <Log />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={t}
      />
      <TransitionSeries.Sequence
        name="Muscles"
        durationInFrames={Math.round(4.5 * fps)}
      >
        <Muscles />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={t}
      />
      <TransitionSeries.Sequence
        name="Beat last week"
        durationInFrames={4 * fps}
      >
        <Beat />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={t}
      />
      <TransitionSeries.Sequence
        name="Share"
        durationInFrames={Math.round(3.5 * fps)}
      >
        <Share />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={t} />
      <TransitionSeries.Sequence name="Outro" durationInFrames={3 * fps}>
        <Intro line="Every set counts." />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
