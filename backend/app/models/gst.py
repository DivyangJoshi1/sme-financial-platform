from sqlalchemy import Column, Integer, Float, String
from app.database import Base

class GSTReturn(Base):
    __tablename__ = "gst_returns"

    id = Column(Integer, primary_key=True, index=True)
    period = Column(String)  # e.g. 2024-06
    output_gst = Column(Float)  # GST collected on sales
    input_gst = Column(Float)   # GST paid on purchases
    filed = Column(Integer)     # 1 = filed, 0 = not filed
    business_id = Column(Integer)