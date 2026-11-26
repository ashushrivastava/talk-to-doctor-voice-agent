import { LoaderCircle, Mic, Phone, PhoneOff } from "lucide-react";
import { AgentAudioVisualizerAura } from "@/components/agent-audio-visualizer-aura";
import { useCall } from "@/components/call-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function CallCard() {
  const { state, label, inCall, connecting, seconds, message, audioTrack, startCall, endCall } = useCall();

  return (
    <Card id="talk" className="relative mx-auto w-full max-w-md scroll-mt-24 gap-0 overflow-hidden p-0 shadow-xl ring-1 ring-border">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          Assistant online
        </div>
        <Badge variant="secondary">24/7</Badge>
      </div>

      <div className="flex flex-col items-center px-6 pt-8 pb-6">
        <div className="relative flex size-56 items-center justify-center">
          <AgentAudioVisualizerAura
            size="lg"
            color="#2563eb"
            colorShift={0.2}
            state={state}
            audioTrack={audioTrack}
            className="size-56"
          />
        </div>

        <p aria-live="polite" className="mt-4 flex items-center gap-2 text-base font-medium">
          {connecting && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
          {label}
          {inCall && <span className="text-muted-foreground tabular-nums">{formatTime(seconds)}</span>}
        </p>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {inCall ? "Speak naturally in Hindi, English or Hinglish." : "Tap the button and say hello."}
        </p>

        <div className="mt-6 w-full">
          {inCall ? (
            <Button size="lg" variant="destructive" className="h-12 w-full text-base" onClick={() => void endCall()}>
              <PhoneOff aria-hidden /> End call
            </Button>
          ) : (
            <Button size="lg" className="h-12 w-full text-base" disabled={connecting} onClick={() => void startCall()}>
              {connecting ? <LoaderCircle className="animate-spin" aria-hidden /> : <Phone aria-hidden />}
              {connecting ? "Connecting" : "Talk to Doctor"}
            </Button>
          )}
        </div>

        {message && (
          <p role="status" className="mt-4 text-center text-sm text-muted-foreground">
            {message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-2 border-t bg-muted/40 px-5 py-3 text-xs leading-relaxed text-muted-foreground">
        <Mic className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        <p>
          You are speaking with an AI assistant, not a person. It cannot give medical advice. In an emergency, go to the
          nearest hospital or call 112.
        </p>
      </div>
    </Card>
  );
}
