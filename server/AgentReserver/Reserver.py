# Download the helper library from https://www.twilio.com/docs/python/install
import os
from twilio.rest import Client
from dotenv import load_dotenv
from flask import Blueprint, request, jsonify
from twilio.twiml.voice_response import VoiceResponse
import re



load_dotenv()
#reserver = Blueprint("reserver", __name__)
account_sid = os.environ.get("account_sid")
auth_token = os.environ.get("auth_token")

client = Client(account_sid, auth_token)

# Dummy data for reserved and unreserved times
reserved_times = ["1:00 PM", "3:00 PM"]
unreserved_times = ["2:00 PM", "4:00 PM"]

def is_slot_available(requested_time):
    return requested_time not in reserved_times

def suggest_alternative_times():
    return unreserved_times

call = client.messages.create(
  body="Hello, World!",
  to="+16476543141",
  from_="+14322391186"
)
print(call.sid)


# @reserver.route("/reserver", methods=["POST"])
# def reserver():
#     response = VoiceResponse()
#     gather = response.gather(input="speech", action="/process_speech", method="POST")
#     gather.say("What is your name and when would you like to book an appointment?")
#     response.append(gather)
#     return jsonify({"message": "Hello, World!"})



# @reserver.route("/process_speech", methods=["POST"])
# def process_speech():
#     user_input = request.form.get("SpeechResult")
#     requested_time = extract_time_from_input(user_input)

#     response = VoiceResponse()
#     if requested_time and is_slot_available(requested_time):
#         response.say(f"Your appointment is confirmed for {requested_time}.")
#     elif requested_time:
#         alternatives = suggest_alternative_times()
#         response.say(f"Sorry, the slot at {requested_time} is taken. How about {alternatives[0]} or {alternatives[1]}?")
#     else:
#         response.say("I couldn't understand the time you requested. Please try again.")
    
#     return str(response)

def extract_time_from_input(user_input):
    # Use a regular expression to find a time in the format "h:mm AM/PM"
    match = re.search(r'\b\d{1,2}:\d{2} [APap][Mm]\b', user_input)
    if match:
        return match.group(0)
    else:
        # If no time is found, return a default or handle the error
        return None


