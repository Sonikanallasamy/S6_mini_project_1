from pydantic import BaseModel

class ScanHistoryResponse(BaseModel):
    id: int
    username: str
    medicine_name: str
    detected_text: str
    status: str

    class Config:
        from_attributes = True