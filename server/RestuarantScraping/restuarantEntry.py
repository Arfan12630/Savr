import os
from flask import Blueprint, request, jsonify
from langchain.chat_models import ChatOpenAI
from langchain.tools import create_openai_fn_tool
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory
from langchain.tools import Tool
# Set up your OpenAI API key (or use dotenv)
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

def store_restuarant_data(restuarant_name=None, location=None, availabe_hours=None, menuImages=None):
    return {restuarant_name:restuarant_name, location:location, availabe_hours:availabe_hours, menuImages:menuImages}

store_info_tool = Tool(
    name="StoreRestaurantInfo",
    func=store_restuarant_data,
    description="Store restaurant name,city, location, menu images, and available hours."
)

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=OPENAI_API_KEY)

agent = initialize_agent([store_info_tool], llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, memory=memory)

def chatbot_response(user_input):
    prompt = (
        "You are collecting restaurant information. "
        "Ask for one missing piece of information at a time: restaurant name, location, available hours, or menu images. "
        "When you have all, confirm the info and thank the user.\n"
        f"User: {user_input}"
    )
    return agent.invoke({"input": prompt})

restuarant_entry_bp = Blueprint('restuarant_entry', __name__)

@restuarant_entry_bp.route('/restaurant-entry', methods=['POST'])
def restaurant_entry_chat():
    data = request.get_json()
    user_message = data.get("message", "")
    if not user_message:
        # Initial prompt if no user message
        return jsonify({"message": "Welcome! Let's add a restaurant. What is the restaurant's name?"})

    try:
        response = chatbot_response(user_message)
        return jsonify({"message": response})
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500
