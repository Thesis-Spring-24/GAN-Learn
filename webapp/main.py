from uuid import uuid4
from os import remove
from PIL import Image, ImageDraw
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from starlette.background import BackgroundTask
from fastapi.middleware.cors import CORSMiddleware



class ImageData(BaseModel):
    strokes: list
    box: list


app = FastAPI()

@app.get("/generator")
async def generator():
    return FileResponse("./static/generator.html")

@app.get("/discriminator")
async def discriminator():
    return FileResponse("./static/discriminator.html")

@app.get("/overview")
async def overview():
    return FileResponse("./static/overview.html")

# Allow all origins and headers for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/transform")
async def options_transform():
    return {"allow": "POST"}

@app.post("/transform")
async def transform(image_data: ImageData):
    filepath = "./images/" + str(uuid4()) + ".png"
    img = transform_img(image_data.strokes, image_data.box)
    img.save(filepath)

    return FileResponse(filepath, background=BackgroundTask(remove, path=filepath))


app.mount("/", StaticFiles(directory="static", html=True), name="static")


def transform_img(strokes, box):
    # Calc cropped image size
    width = box[2] - box[0]
    height = box[3] - box[1]

    image = Image.new("RGB", (width, height), color=(255, 255, 255))
    image_draw = ImageDraw.Draw(image)

    for stroke in strokes:
        positions = []
        for i in range(0, len(stroke[0])):
            positions.append((stroke[0][i], stroke[1][i]))
        image_draw.line(positions, fill=(0, 0, 0), width=3)

    return image.resize(size=(28, 28))
