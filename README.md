### Frontend : Typescript / React / Redux toolkit / axios / scss modules

### Backend : Typescript / Node.js / Express / Express-ws / Sequelize as ORM
### Database : Postgres

# Run with docker-compose
## 1.Copy project from github
## 2.Move to /backend directory and run : npm install
## 3.Move to /frontend directory and run : npm install
## 4.Run docker engine on your machine
## 5.Run : docker-compose up --build
# Run on localhost (you need to have postgres or any other db installed)
## 1.Copy project from github
## 2. In backend/src/dev.env: 
    POSTGRES_PORT=your_db_port
    POSTGRES_USER=your_db_user
    POSTRESS_HOST=localhost
    POSTGRES_DB=your_db_name
    POSTGRES_PASSWORD=your_db_password
## 3. In ./backend/database/database.ts change Sequlize's model's dialect on yours.
## 4.run backend : npm run dev
## 5.run frontend : npm start

# Project Demo - https://www.youtube.com/watch?v=u3zU2ZCAGF4&t=25s&ab_channel=AlOl

## Future updates
# Frontend : Drag and Drop events / Board customization / Profile Page
# Backend : Game History / Match Analysis