from sqlalchemy import Column, Integer, Float, String
from app.database import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    lender = Column(String)
    monthly_emi = Column(Float)
    outstanding_amount = Column(Float)
    business_id = Column(Integer)