import { randomUUID } from "node:crypto";
import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";

const AGENT_NAME = "dental-receptionist";

// Implements LiveKit's standard token endpoint (POST in, 201 with server_url and
// participant_token out). The request body is ignored on purpose: room name, identity
// and agent dispatch are always chosen here, so a visitor cannot pick a different agent.
export default async () => {
  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return Response.json({ error: "Server is not configured" }, { status: 500 });
  }

  const id = randomUUID().replace(/-/g, "").slice(0, 10);
  const room = `web-${id}`;

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: `visitor-${id}`,
    name: "Website visitor",
    ttl: "10m",
  });
  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });
  at.roomConfig = new RoomConfiguration({
    agents: [new RoomAgentDispatch({ agentName: AGENT_NAME })],
  });

  const token = await at.toJwt();
  return Response.json(
    { server_url: LIVEKIT_URL, participant_token: token, token, url: LIVEKIT_URL, room },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
};

export const config = {
  path: "/api/token",
  rateLimit: { windowLimit: 6, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
