import ASCIIAnimation from "@/components/ascii-animation";

export function SpaceAscii() {
  return (
    <ASCIIAnimation
      ariaLabel="Animated ASCII wireframe cube"
      className="h-[44vh] max-h-[520px] min-h-[260px] w-full max-w-[720px]"
      color="currentColor"
      fps={20}
      frameCount={134}
      frameFolder="animations/cube"
      lazy={false}
      quality="high"
      textSize="text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px]"
    />
  );
}
