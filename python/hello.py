from fastapi import FastAPI, File, UploadFile, Request
app = FastAPI()

@app.middleware("http")
async def simple_middleware(request: Request, call_next):
    print("headers")
    for name, value in request.headers.items():
        print(f"{name}: {value}")

    body = await request.body()
    print(f"Body length: {len(body)} bytes")

    response = await call_next(request)
    return response


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
   print(file)
   print("receive")
   return {"filename": file.filename}

