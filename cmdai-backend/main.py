from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai

genai.configure(api_key="AIzaSyDCqDpUvHVlLIrVM6HW9VkTMvnAzBZaooo")

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
    response = model.generate_content(
        f"Context:\n{data.context}\n\nQuestion:\n{data.query}"
    )
    return {"answer": response.text}