from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import pets, habits, sync, tasks, daily_habits

app = FastAPI(title="HOSTAGE MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
