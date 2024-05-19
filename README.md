# GAN Learn

GAN Learn is a digital learning tool, which allows students to explore how the generative network called GAN can learn to generate fake images and get an understanding of the different tasks involved in a GAN network. The digital learning tool guides the students through different activities: “Generator activity”, “Discriminator activity” and “Process activity”. 

## Setup

### webapp

#### Native

Switch to the `webapp` directory, create another venv and install the requirements as mentioned above. You can run the webapp using the following command:

```
uvicorn main:app
```

The webapp should be available at [http://127.0.0.1:8000](http://127.0.0.1:8000).

#### Docker

Alternatively, you can also run it via Docker:

```
docker build . -t quickdraw-webapp
docker run -p 443:443 quickdraw-webapp
```

The webapp should be available at [http://0.0.0.0:443](http://0.0.0.0:443).
