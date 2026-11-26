import { AgentAudioVisualizerAura } from "@/components/agent-audio-visualizer-aura";
import { useCall } from "@/components/call-provider";

// Decorative background glow. It is rendered small and scaled up with CSS so the shader stays cheap,
// and it reacts to the assistant's voice during a call.
export function HeroAura() {
  const { state, audioTrack } = useCall();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex h-[720px] items-start justify-center overflow-hidden [mask-image:radial-gradient(ellipse_closest-side,black_35%,transparent_100%)] opacity-70 dark:opacity-60"
    >
      <AgentAudioVisualizerAura
        size="xl"
        color="#2563eb"
        colorShift={0.25}
        state={state}
        audioTrack={audioTrack}
        className="mt-10 size-[448px] shrink-0 origin-top scale-[2.3] blur-[2px]"
      />
    </div>
  );
}
