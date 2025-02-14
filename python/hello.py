from fastapi import FastAPI, File, UploadFile, Request

app = FastAPI()

@app.middleware("http")
async def middleware(request: Request, call_next):
    print("before")
    for header, value in request.headers.items():
        print(f"  {header}: {value}")

    response = await call_next(request)
    return response

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
   print(file)
   print("receive")
   return {"filename": file.filename}

