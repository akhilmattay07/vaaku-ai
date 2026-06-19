from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, audio, progress, adaptive

app = FastAPI(title="Vaaku AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://vaaku-ai.vercel.app",
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router,  prefix="/api")
app.include_router(audio.router,    prefix="/api")
app.include_router(progress.router, prefix="/api")
app.include_router(adaptive.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "Vaaku AI backend running"}