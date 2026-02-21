from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow extension to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestData(BaseModel):
    query: str
    context: str

@app.post("/ask")
async def ask(data: RequestData):
    # For now just return mock response
    return {
        "answer": f"You asked: {data.query}\n\n(Page length: {len(data.context)} characters)"
    }