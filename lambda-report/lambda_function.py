import json
import os
import urllib.error
import urllib.request
from collections import Counter
from decimal import Decimal, InvalidOperation

BACKEND_URL = os.environ.get("BACKEND_URL", "").rstrip("/")
GAMES_PATH = os.environ.get("GAMES_PATH", "/api/games")
TIMEOUT_SECONDS = int(os.environ.get("TIMEOUT_SECONDS", "10"))


def _response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
        "body": json.dumps(body, ensure_ascii=False),
    }


def _to_decimal(value):
    if value is None:
        return Decimal("0")

    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError):
        return Decimal("0")


def _safe_text(value, default="Unknown"):
    if value is None:
        return default

    value = str(value).strip()
    return value if value else default


def _fetch_games():
    if not BACKEND_URL:
        raise RuntimeError("Environment variable BACKEND_URL is not configured.")

    url = f"{BACKEND_URL}{GAMES_PATH}"

    request = urllib.request.Request(
        url,
        method="GET",
        headers={"Accept": "application/json"},
    )

    with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
        status = response.getcode()
        raw_body = response.read().decode("utf-8")

    if status < 200 or status >= 300:
        raise RuntimeError(f"Backend returned status {status}: {raw_body}")

    data = json.loads(raw_body)

    if not isinstance(data, list):
        raise RuntimeError("Backend response must be a JSON list of games.")

    return data


def _simplify_game(game):
    if not game:
        return None

    return {
        "id": game.get("id"),
        "title": game.get("title"),
        "genre": game.get("genre"),
        "platform": game.get("platform"),
        "developer": game.g




clear
