from pydantic import BaseModel, Field, HttpUrl


class ResolveRequest(BaseModel):
    url: str = Field(..., min_length=10, max_length=2048)
