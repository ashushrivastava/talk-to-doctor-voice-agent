import type { ComponentProps } from "react";
import { LoaderCircle, Phone } from "lucide-react";
import { useCall } from "@/components/call-provider";
import { Button } from "@/components/ui/button";

type Props = Omit<ComponentProps<typeof Button>, "onClick" | "children" | "asChild">;

// Every "Talk to Doctor" on the page starts the same call and brings the call card into view.
export function CallButton(props: Props) {
  const { inCall, connecting, startCall } = useCall();
  return (
    <Button {...props} disabled={connecting} onClick={() => void startCall()}>
      {connecting ? <LoaderCircle className="animate-spin" aria-hidden /> : <Phone aria-hidden />}
      {connecting ? "Connecting" : inCall ? "Return to call" : "Talk to Doctor"}
    </Button>
  );
}
