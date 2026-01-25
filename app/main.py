from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import pets, habits, sync, tasks, daily_habits
import os

app = FastAPI(title="HOSTAGE MVP")

# CORS設定（環境変数で本番/開発を切り替え）
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://hostage-app.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "HOSTAGE System Online", "status": "ALIVE"}

app.include_router(pets.router)
app.include_router(habits.router)
app.include_router(sync.router)
app.include_router(tasks.router)
app.include_router(daily_habits.router)
