from sqlalchemy import Column, Integer, String, Text
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    medicine_name = Column(String)
    detected_text = Column(Text)
    status = Column(String)

    # ✅ STORE FILE PATH (NOT BASE64)
    image = Column(String, nullable=True)