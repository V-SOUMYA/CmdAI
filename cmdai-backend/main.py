from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai

genai.configure(api_key="YOUR_GEMINI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = genai.GenerativeModel("gemini-1.5-flash")

class RequestData(BaseModel):
    query: str
    context: str

@app.post("/ask")
async def ask(data: RequestData):

    prompt = f"""
You are CmdAI, an AI assistant embedded in a browser.

The user is viewing a webpage.

Page content:
{data.context}

User question:
{data.query}

Answer clearly and concisely.
"""

    response = model.generate_content(prompt)

    return {
        "answer": response.text
    }