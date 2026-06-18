from dotenv import load_dotenv
import os

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
SUPABASE_URL      = os.getenv("SUPABASE_URL")
SUPABASE_KEY      = os.getenv("SUPABASE_KEY")
WHISPER_MODEL     = os.getenv("WHISPER_MODEL", "base")
FRONTEND_URL      = os.getenv("FRONTEND_URL", "http://localhost:5173")