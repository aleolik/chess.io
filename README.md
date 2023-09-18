# Frontend : Typescript / React / Redux toolkit / axios / scss modules

# Backend : Typescript / Node.js / Express / Express-ws / Sequelize as ORM
# Database : Postgres

### Run with docker-compose
## 1.Copy project from github
## 2.Run : docker-compose up --build
### Run on localhost (you need to have postgres or any other db installed)
## 1.Copy project from github
## 2. In backend/src/dev.env and ./.env change values : 
    POSTGRES_PORT=your_db_port
    POSTGRES_USER=your_db_user
    POSTRESS_HOST=localhost
    POSTGRES_DB=your_db_name
    POSTGRES_PASSWORD=your_db_password
# run database on your localhost
## run frontend : npm start
## run backend : npm run dev