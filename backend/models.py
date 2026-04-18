from sqlalchemy import Column, Integer, String, Text
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    medicine_name = Column(String, nullable=False)
    detected_text = Column(Text, nullable=True)
    status = Column(String, nullable=False)
    image = Column(String, nullable=True)