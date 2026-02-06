from sqlalchemy import Column, Integer, Float, String, Date
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    description = Column(String)
    amount = Column(Float)
    category = Column(String)
    business_id = Column(Integer)