from app.database import engine
from app.models.financial import Transaction
from app.database import Base
from app.models.loan import Loan
from app.models.gst import GSTReturn
from app.models.benchmark import IndustryBenchmark
from app.models.user import User

Base.metadata.create_all(bind=engine)
print("Tables created successfully")
