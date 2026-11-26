import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { TokenSource } from "livekit-client";
import {
  useAgent,
  useSession,
  type AgentState,
  type TrackReferenceOrPlaceholder,
  type UseSessionReturn,
} from "@livekit/components-react";
import { AgentSessionProvider } from "@/components/agent-session-provider";

const TOKEN_SOURCE = TokenSource.endpoint("/api/token");
const AGENT_NAME = "dental-receptionist";

const STATUS_LABEL: Record<string, string> = {
  disconnected: "Ready when you are",
  connecting: "Connecting you to the assistant",
  initializing: "Connecting you to the assistant",
  idle: "Connecting you to the assistant",
  "pre-connect-buffering": "Connecting you to the assistant",
  listening: "Listening to you",
  thinking: "Thinking",
  speaking: "Speaking",
  failed: "Could not reach the assistant",
};

type CallContextValue = {
  state: AgentState;
  label: string;
  inCall: boolean;
  connecting: boolean;
  seconds: number;
  message: string | null;
  audioTrack: TrackReferenceOrPlaceholder | undefined;
  startCall: () => Promise<void>;
  endCall: () => Promise<void>;
};

const CallContext = createContext<CallContextValue | null>(null);

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCall must be used inside CallProvider");
  return ctx;
}

function CallState({ session, children }: { session: UseSessionReturn; children: ReactNode }) {
  const agent = useAgent();
  const [starting, setStarting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const hadAgent = useRef(false);

  const inCall = session.isConnected;
  const live = agent.state === "listening" || agent.state === "thinking" || agent.state === "speaking";

  useEffect(() => {
    if (live) hadAgent.current = true;
  }, [live]);

  useEffect(() => {
    if (inCall) setStarting(false);
  }, [inCall]);

  useEffect(() => {
    if (!inCall) {
      setSeconds(0);
      return;
    }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [inCall]);

  const finish = useCallback(
    async (note?: string) => {
      try {
        await session.end();
      } finally {
        hadAgent.current = false;
        setStarting(false);
        setMessage(note ?? null);
      }
    },
    [session],
  );

  useEffect(() => {
    if (inCall && hadAgent.current && (agent.state === "disconnected" || agent.state === "failed")) {
      void finish("The call has ended. Thank you for calling. The clinic team will confirm your appointment.");
    }
  }, [inCall, agent.state, finish]);

  const startCall = useCallback(async () => {
    document.getElementById("talk")?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (session.isConnected || starting) return;
    setMessage(null);
    setStarting(true);
    try {
      await session.start({ tracks: { microphone: { enabled: true } } });
    } catch (e) {
      const denied = e instanceof Error && /permission|denied|notallowed/i.test(`${e.name} ${e.message}`);
      setMessage(
        denied
          ? "Microphone access is blocked. Please allow the microphone in your browser and try again."
          : "We could not connect the call. Please try again in a moment.",
      );
      setStarting(false);
    }
  }, [session, starting]);

  const endCall = useCallback(() => finish("Call ended."), [finish]);

  const connecting = starting || (!inCall && session.connectionState === "connecting");
  const state: AgentState = inCall ? agent.state : connecting ? "connecting" : "disconnected";

  const value = useMemo<CallContextValue>(
    () => ({
      state,
      label: STATUS_LABEL[state] ?? "Ready when you are",
      inCall,
      connecting,
      seconds,
      message,
      audioTrack: agent.microphoneTrack,
      startCall,
      endCall,
    }),
    [state, inCall, connecting, seconds, message, agent.microphoneTrack, startCall, endCall],
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}

export function CallProvider({ children }: { children: ReactNode }) {
  const session = useSession(TOKEN_SOURCE, { agentName: AGENT_NAME });
  return (
    <AgentSessionProvider session={session}>
      <CallState session={session}>{children}</CallState>
    </AgentSessionProvider>
  );
}
