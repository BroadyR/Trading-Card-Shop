####### HOW TO RUN #######
Locally:
    WebApp:
        1. Open two terminals in the root directory
        2. Terminal 1 type nodemon app.js or however you wanna start the backend server
        3. Terminal 2 type npm start to launch the front end and be brought to the login
    MongoDB:
        1. Open Mongodb Compass
        2. Copy your connection string
        3. In the mongo.js file replace the mongodb connect string with your own ex. "mongodb://<user>:<passord>@localhost:27017/trading-card-db"


Docker Desktop:
    webapp:
        1. In a terminal in the root dir run docker-compose build
        2. Then run docker-compose up
    Mongodb:
        1. Open Mongodb compass
        2. in the connection URI place your mongodb connection string
        3. Click connect to connect mongodb Compass with your Docker Container

**NOTE: upload folder has images from when it was being done in my local db. Feel free to delete as junk when doing personal use.
Issue: on refresh email would be lost loosing you access to your cart
Fix: saveEmail is saved locally in UserContext File