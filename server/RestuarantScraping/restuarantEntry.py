import os
from flask import Blueprint, request, jsonify, session
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory
import traceback

# Set up OpenAI API key
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# LangChain LLM setup
llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=OPENAI_API_KEY)

# Create Flask Blueprint
restuarant_entry_bp = Blueprint('restuarant_entry', __name__)

# Global store for user sessions and memory
user_sessions = {}

def get_agent_for_user(user_id):
    if user_id not in user_sessions:
        memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

        # System message to act as onboarding assistant for owners
        memory.chat_memory.add_user_message("""
You are a friendly assistant helping restaurant owners onboard their restaurant details into our system.
You MUST collect the following information step by step:
1. Owner full name
2. Restaurant name
3. City
4. Province/State
5. Country
6. Available hours (e.g. Mon-Fri 9AM to 10PM)
7. Menu images link (optional)

Rules:
- Ask ONLY one question at a time.
- Do NOT proceed to the next question until the user gives a clear answer.
- Always confirm what the user answered before moving to the next question.
- Be polite, encouraging, and conversational.
- At the end, confirm all collected information in a neat list.
- If the user says "restart", reset the process.
""")

        agent = initialize_agent(
            tools=[],
            llm=llm,
            agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
            memory=memory,
            verbose=True,
            handle_parsing_errors=True
        )

        user_sessions[user_id] = {"agent": agent, "memory": memory, "intro_shown": False}

    return user_sessions[user_id]

@restuarant_entry_bp.route("/restaurant-entry", methods=["POST"])
def chat_with_restaurant_agent():
    try:
        user_id = session.get('user_id') or 'default_user'
        user_input = request.json.get("message")

        session_data = get_agent_for_user(user_id)
        agent = session_data["agent"]
        intro_shown = session_data["intro_shown"]

        # Show intro on first interaction
        if not intro_shown:
            intro_message = "👋 Hi there! I'm here to help you onboard your restaurant into our system. I'll ask you a few questions step by step. Let's get started!"
            session_data["intro_shown"] = True
            return jsonify({"reply": intro_message})

        # Let the agent handle the conversation
        response = agent.run(user_input)

        # Check if the response is a parsing error and handle it
        if "Could not parse LLM output" in response:
            # Extract the green output part
            start_index = response.find("AI: ") + 4
            end_index = response.find("For troubleshooting")
            green_output = response[start_index:end_index].strip()
            return jsonify({"reply": green_output})

        return jsonify({"reply": response})

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "reply": "⚠️ Sorry, I ran into an error while processing your message. Can you please try again?"
        }), 500
