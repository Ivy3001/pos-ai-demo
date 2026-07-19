"""
Counter POS — AI chat service.

Exposes POST /chat, matching the contract the Next.js proxy route expects:
    request:  { "message": str, "history": [{"role": str, "text": str}] }
    response: { "reply": str }

Behavior:
- If MISTRAL_API_KEY is set in the environment, real questions are answered
  by Mistral, grounded in products.json (a copy of the frontend's mock
  catalog) via a system prompt.
- If no key is set (e.g. demoing before the real key is available), it
  falls back to a catalog-aware rule-based responder so the demo still
  works end-to-end instead of erroring out.

Run locally:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000
"""

import json
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
MISTRAL_MODEL = os.getenv("MISTRAL_MODEL", "mistral-small-latest")

app = FastAPI(title="Counter POS AI Service")

# Allow the Next.js dev server (and your deployed frontend) to call this.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

CATALOG = json.loads(Path(__file__).parent.joinpath("products.json").read_text())
ASSOCIATES = json.loads(Path(__file__).parent.joinpath("associates.json").read_text())
ORDERS_FILE = Path(__file__).parent.joinpath("orders.json")
if not ORDERS_FILE.exists():
    ORDERS_FILE.write_text("[]")


class Message(BaseModel):
    role: str
    text: str


class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []


class ChatResponse(BaseModel):
    reply: str


class LoginRequest(BaseModel):
    associateId: str
    pin: str


class LoginResponse(BaseModel):
    ok: bool
    name: str | None = None
    error: str | None = None


class CartItem(BaseModel):
    id: str
    name: str
    price: float
    qty: int
    unit: str


class CheckoutRequest(BaseModel):
    items: list[CartItem]
    associateId: str | None = None


class CheckoutResponse(BaseModel):
    ok: bool
    orderId: str
    total: float


def build_system_prompt() -> str:
    catalog_lines = "\n".join(
        f"- {p['name']} ({p['category']}): ${p['price']}/{p['unit']}, "
        f"allergens: {', '.join(p['allergens']) or 'none'}"
        for p in CATALOG
    )
    return (
        "You are a helpful counter assistant at a butcher shop and deli. "
        "You answer customer questions about products, cuts, cooking, "
        "portions, and allergens for a sales associate to relay. Keep "
        "answers short (2-4 sentences), practical, and friendly. Only "
        "state allergen or price info you can see in the catalog below — "
        "if something isn't in the catalog, say you're not sure and to "
        "check with staff.\n\nCurrent catalog:\n" + catalog_lines
    )


def call_mistral(message: str, history: list[Message]) -> str:
    from mistralai import Mistral

    client = Mistral(api_key=MISTRAL_API_KEY)
    messages = [{"role": "system", "content": build_system_prompt()}]
    for m in history[-10:]:  # keep the payload small
        role = "assistant" if m.role == "assistant" else "user"
        messages.append({"role": role, "content": m.text})
    messages.append({"role": "user", "content": message})

    response = client.chat.complete(model=MISTRAL_MODEL, messages=messages)
    return response.choices[0].message.content


def fallback_reply(message: str) -> str:
    """Catalog-aware rule-based responder, used when MISTRAL_API_KEY isn't set."""
    text = message.lower()

    if re.search(r"allerg|nut|dairy|gluten", text):
        for p in CATALOG:
            if p["name"].lower() in text:
                note = (
                    f"Contains: {', '.join(p['allergens'])}."
                    if p["allergens"]
                    else "No listed allergens."
                )
                return f"{p['name']}: {note} (Demo mode — connect MISTRAL_API_KEY for full AI answers.)"
        return (
            "I can check allergens for a specific item if you tell me which "
            "product — e.g. 'does the Swiss Cheese have allergens?'. "
            "(Demo mode — connect MISTRAL_API_KEY for full AI answers.)"
        )
    if re.search(r"cook|roast|grill|slow cook", text):
        return (
            "For roasts, low and slow (6-8 hrs) breaks down connective "
            "tissue nicely; steaks like the ribeye do well hot and fast. "
            "(Demo mode — connect MISTRAL_API_KEY for full AI answers.)"
        )
    if re.search(r"how much|serve|people|feed", text):
        return (
            "Rule of thumb is about 0.5 lb of meat per person for a main. "
            "(Demo mode — connect MISTRAL_API_KEY for full AI answers.)"
        )

    # Plain product lookup (price/general info) as the last resort.
    for p in CATALOG:
        if p["name"].lower() in text:
            allergen_note = (
                f" Contains: {', '.join(p['allergens'])}."
                if p["allergens"]
                else " No listed allergens."
            )
            return (
                f"{p['name']} is ${p['price']:.2f} per {p['unit']}.{allergen_note} "
                "(Demo mode — connect MISTRAL_API_KEY for full AI answers.)"
            )

    return (
        "I'm running in demo mode without a live model connected yet, so "
        "I can only answer basic catalog questions right now — try asking "
        "about a specific item like the Ribeye Steak or Genoa Salami."
    )


@app.get("/health")
def health():
    return {"status": "ok", "mistral_connected": bool(MISTRAL_API_KEY)}


@app.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    for a in ASSOCIATES:
        if a["associateId"] == req.associateId and a["pin"] == req.pin:
            return LoginResponse(ok=True, name=a["name"])
    return LoginResponse(ok=False, error="Invalid associate ID or PIN.")


@app.post("/checkout", response_model=CheckoutResponse)
def checkout(req: CheckoutRequest):
    total = sum(i.price * i.qty for i in req.items)
    orders = json.loads(ORDERS_FILE.read_text())
    order_id = f"ORD-{len(orders) + 1:04d}"
    orders.append(
        {
            "orderId": order_id,
            "associateId": req.associateId,
            "items": [i.model_dump() for i in req.items],
            "total": round(total, 2),
        }
    )
    ORDERS_FILE.write_text(json.dumps(orders, indent=2))
    return CheckoutResponse(ok=True, orderId=order_id, total=round(total, 2))


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if MISTRAL_API_KEY:
        try:
            return ChatResponse(reply=call_mistral(req.message, req.history))
        except Exception:
            return ChatResponse(
                reply=f"(Mistral call failed, falling back) {fallback_reply(req.message)}"
            )
    return ChatResponse(reply=fallback_reply(req.message))
