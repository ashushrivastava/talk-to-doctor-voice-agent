import asyncio
import json
import sys
import uuid

from dotenv import load_dotenv
from livekit import api

load_dotenv(".env")


async def main(phone_number: str, purpose: str) -> None:
    lkapi = api.LiveKitAPI()
    try:
        dispatch = await lkapi.agent_dispatch.create_dispatch(
            api.CreateAgentDispatchRequest(
                agent_name="dental-receptionist",
                room=f"outbound-{uuid.uuid4().hex[:8]}",
                metadata=json.dumps({"phone_number": phone_number, "purpose": purpose}),
            )
        )
        print(f"Dispatched agent to room {dispatch.room}; it will dial {phone_number}.")
    finally:
        await lkapi.aclose()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit('Usage: python make_call.py +15551234567 "Reminder for tomorrow\'s 2pm cleaning"')
    asyncio.run(main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "Appointment reminder call"))
