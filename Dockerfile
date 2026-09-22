# Monorepo-root Dockerfile for Railway (when Root Directory is unset).
# Prefer setting Root Directory = services/extractor and using that folder's Dockerfile.

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY services/extractor/requirements.txt .
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

COPY services/extractor/app ./app

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
