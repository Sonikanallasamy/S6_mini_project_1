from pydantic import BaseModel
from typing import Optional


class ScanHistoryResponse(BaseModel):
    id: int
    username: str
    medicine_name: str
    detected_text: Optional[str] = ""
    status: str
    image: Optional[str] = None

    class Config:
        from_attributes = True