import asyncio
import json
import logging
import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from livekit import agents, api
from livekit.agents import Agent, AgentServer, AgentSession, JobContext, RunContext, function_tool, inference, room_io
from livekit.plugins import noise_cancellation, silero

load_dotenv(".env")
logger = logging.getLogger("dental-receptionist")

AGENT_NAME = "dental-receptionist"
STT_LANGUAGE = os.getenv("STT_LANGUAGE", "multi")
TTS_LANGUAGE = os.getenv("TTS_LANGUAGE", "hi")
MAX_CALL_SECONDS = int(os.getenv("MAX_CALL_SECONDS", "180"))
TTS_VOICE = os.getenv("TTS_VOICE", "4459a9a5-69d6-4680-b970-e13dc51845b6")

INSTRUCTIONS = """You are the virtual assistant for Dr. Sneha Soni's clinic, The Smile & Glow Studio, in Kankarbagh, Patna.
You are an AI, and you say so briefly in your greeting. Your single goal is to warmly help the caller and book an appointment with the doctor within about 2 to 2.5 minutes.

Language: Speak Hindi, English or Hinglish, matching whatever the caller uses, and switch if they switch.
When you speak Hindi, write it in Devanagari script and keep common English words (appointment, braces, root canal) in English. Keep every turn to one or two short, natural sentences. This is a phone-style conversation: no lists, no markdown, no emojis.

Tone: warm, calm and empathetic, like a caring front-desk person. Acknowledge the concern first ("pain mein hona sach mein mushkil hota hai") before asking anything.

Call flow:
1. Greet, say you are the clinic's AI assistant, and ask how you can help.
2. Listen. Show empathy. Ask one short follow-up about the problem (what, and for how long).
3. Briefly explain how the clinic can help, using only the facts below. The doctor will examine and advise; you do not diagnose.
4. Move to booking. Collect the patient's name, a phone number, and a preferred day and time. Do NOT ask for an address.
5. Read the details back, then call the book_appointment tool.
6. Close warmly: the clinic team will confirm the slot, thank them, and end the call. Do not keep chatting after booking.

Facts you may state:
- Doctor: Dr. Sneha Soni, orthodontist and dental surgeon (BDS, MDS in Orthodontics).
- Clinic: The Smile & Glow Studio, Kankarbagh, Patna.
- Treatments: braces and clear aligners, root canal treatment, dental implants, smile designing and aesthetic dentistry, gum disease treatment.
- The clinic generally opens around 9 AM. For exact timings, say the team will confirm when they call back.

Rules:
- Never give medical advice, a diagnosis, or prices. For cost questions say the doctor explains the options and costs at the consultation.
- For anything you do not know, say the clinic team will confirm it. Do not invent services, timings or qualifications.
- For a severe emergency (heavy bleeding, swelling that affects breathing or swallowing, high fever with facial swelling), tell the caller to go to the nearest hospital or call 112 right away, then offer a follow-up booking.
- Only book a request; do not promise a confirmed slot.
"""


class Receptionist(Agent):
    def __init__(self, outbound_purpose: str | None = None) -> None:
        extra = ""
        if outbound_purpose:
            extra = (
                f"\nThis is an OUTBOUND call you placed. Purpose: {outbound_purpose}. "
                "Introduce yourself, state why you are calling, and confirm you are speaking with the right person before sharing anything else."
            )
        super().__init__(instructions=INSTRUCTIONS + extra)

    @function_tool
    async def book_appointment(
        self,
        context: RunContext,
        patient_name: str,
        phone_number: str,
        concern: str,
        preferred_time: str,
    ) -> str:
        """Record an appointment request once the caller has confirmed all details.

        Args:
            patient_name: Full name of the patient.
            phone_number: Callback phone number.
            concern: One short phrase describing the dental concern or reason for the visit.
            preferred_time: Preferred day and time, e.g. "Tuesday evening".
        """
        record = {
            "created_at": datetime.now(timezone.utc).isoformat(),
            "patient_name": patient_name,
            "phone_number": phone_number,
            "concern": concern,
            "preferred_time": preferred_time,
        }
        with open("appointments.jsonl", "a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
        logger.info("appointment request saved for %s", patient_name)
        return "Appointment request saved. Tell the caller the clinic team will confirm the slot shortly, thank them, and say goodbye."


server = AgentServer()


@server.rtc_session(agent_name=AGENT_NAME)
async def entrypoint(ctx: JobContext) -> None:
    session = AgentSession(
        stt=inference.STT(model="deepgram/nova-3", language=STT_LANGUAGE),
        llm="openai/gpt-4.1-mini",
        tts=inference.TTS(model="cartesia/sonic-3", voice=TTS_VOICE, language=TTS_LANGUAGE),
        vad=silero.VAD.load(),
        turn_detection=inference.TurnDetector(),
    )

    metadata = json.loads(ctx.job.metadata) if ctx.job.metadata else {}
    phone_number = metadata.get("phone_number")

    await session.start(
        room=ctx.room,
        agent=Receptionist(outbound_purpose=metadata.get("purpose") if phone_number else None),
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(noise_cancellation=noise_cancellation.BVC()),
        ),
    )

    async def enforce_time_limit() -> None:
        await asyncio.sleep(MAX_CALL_SECONDS)
        await session.say("मुझे अब कॉल खत्म करनी होगी। क्लिनिक की टीम आपसे जल्द संपर्क करेगी। धन्यवाद!")
        ctx.shutdown()

    time_limit_task = asyncio.create_task(enforce_time_limit())
    ctx.add_shutdown_callback(lambda: time_limit_task.cancel())

    if phone_number:
        try:
            await ctx.api.sip.create_sip_participant(
                api.CreateSIPParticipantRequest(
                    room_name=ctx.room.name,
                    sip_trunk_id=os.environ["SIP_OUTBOUND_TRUNK_ID"],
                    sip_call_to=phone_number,
                    participant_identity=f"sip_{phone_number}",
                    wait_until_answered=True,
                )
            )
        except Exception:
            logger.exception("outbound call to %s failed", phone_number)
            ctx.shutdown()
            return
        await session.generate_reply(instructions="Greet the person who answered and state why you are calling.")
    else:
        await session.generate_reply(
            instructions="Greet the caller warmly in Hinglish, say you are the AI assistant of Dr. Sneha Soni's clinic, and ask how you can help."
        )


if __name__ == "__main__":
    agents.cli.run_app(server)
