# Hero motion reference

Source: user-supplied `Untitled blend.mp4`, 1920 × 1380, 30 fps, four seconds.

The initial eight-second forward/reverse interpretation was rejected. Its columns changed independently and no longer rose consistently from left to right. `motion.json` records that earlier measurement attempt and is not consumed by the generator.

The current animation follows the user's correction: retain the supplied ascending column profile and apply a broad, slow wave. It uses a 36-second cycle, height variation of 3.5%, and 0.075 radians of phase delay between adjacent columns. Each bar's bottom stays fixed. This is an intentional adaptation, not recovered source animation code.

The generator verifies that all 181 keyframes retain strictly increasing column heights. Linear interpolation between these keyframes preserves that ordering. All 448 supplied colour stops remain unchanged. Reduced motion displays the original static SVG.

Browser checks at 0, 9, 18, 27 and 36 seconds confirmed increasing heights and a fixed bottom for all columns. The start and end heights match. The generated artwork was also inspected in the hero preview. Focused ESLint and deterministic extraction checks pass.
