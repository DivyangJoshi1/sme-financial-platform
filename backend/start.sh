#!/usr/bin/env bash
python create_tables.py
uvicorn app.main:app --host 0.0.0.0 --port 10000
