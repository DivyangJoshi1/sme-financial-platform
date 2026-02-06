from sqlalchemy import Column, Integer, Float, String
from app.database import Base

class IndustryBenchmark(Base):
    __tablename__ = "industry_benchmarks"

    id = Column(Integer, primary_key=True)
    industry = Column(String, unique=True)

    avg_gross_margin = Column(Float)
    avg_net_margin = Column(Float)
    avg_cashflow_margin = Column(Float)
    avg_dscr = Column(Float)