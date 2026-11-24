import { randomUUID } from "node:crypto";
import { AccessToken, RoomAgentDispatch, RoomConfiguration } from "livekit-server-sdk";

const AGENT_NAME = "dental-receptionist";

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

  return Response.json(
    { token: await at.toJwt(), url: LIVEKIT_URL, room },
    { headers: { "Cache-Control": "no-store" } },
  );
};

export const config = {
  path: "/api/token",
  rateLimit: { windowLimit: 6, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
