from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
import os
from dotenv import load_dotenv

load_dotenv()

# Load your OpenAI API key
openai_api_key = os.environ.get("OPENAI_API_KEY")

# Step 1: Define memory
memory = ConversationBufferMemory(memory_key="history")

# Step 2: Create chat model
llm = ChatOpenAI(temperature=0, api_key=openai_api_key)

# Step 3: Create chain with memory
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True,
)

# Step 4: Manual control loop
restaurant_name = None
restaurant_city = None

print("Agent: Welcome! Let’s get your restaurant onboarded.")
while True:
    if not restaurant_name:
        prompt = "Ask the user: What’s the name of your restaurant?"
        response = conversation.predict(input=prompt)
        print("Agent:", response)
        restaurant_name = input("You: ").strip()
        memory.chat_memory.add_user_message(restaurant_name)
        continue

    if not restaurant_city:
        prompt = f"The restaurant name is '{restaurant_name}'. Ask the user: Which city is it located in?"
        response = conversation.predict(input=prompt)
        print("Agent:", response)
        restaurant_city = input("You: ").strip()
        memory.chat_memory.add_user_message(restaurant_city)
        continue

    prompt = (
        f"Confirm: Your restaurant is '{restaurant_name}' in '{restaurant_city}'. Is that correct?"
    )
    response = conversation.predict(input=prompt)
    print("Agent:", response)
    confirmation = input("You: ").strip().lower()

    if "yes" in confirmation:
        print("Agent: Great! Your onboarding info is saved.")
        break
    else:
        print("Agent: No problem. Let’s try again.")
        restaurant_name = None
        restaurant_city = None
