const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware.js");
const networkManager = require("./scripts/networkManager.js");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

app.use("/contract", require("./routes/contractRoutes"));

async function startServer() {
    await networkManager.connect();

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

startServer();
