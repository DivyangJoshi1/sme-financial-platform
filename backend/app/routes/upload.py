from fastapi import APIRouter, UploadFile, File
import pandas as pd
from app.database import SessionLocal
from app.models.financial import Transaction

router = APIRouter(prefix="/upload")

@router.post("/")
async def upload_csv(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)

    db = SessionLocal()
    for _, row in df.iterrows():
        tx = Transaction(
            date=row["date"],
            description=row["description"],
            amount=row["amount"],
            category=row.get("category", "Uncategorized"),
            business_id=1
        )
        db.add(tx)

    db.commit()
    db.close()

    return {"rows_inserted": len(df)}