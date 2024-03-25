import connectDB from "./db/DBConnect.js";
import { app } from "./app.js";
import { port } from "./constants.js";

// import dotenv from "dotenv";
// dotenv.config({
//     path: "./.env",
// });

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`\nServer listening on http://localhost:${port}\nhttps://cloud.mongodb.com/v2/65e29e3793fe07481a154519#/clusters\n
            `);
        });
    })
    .catch((error) => {
        // // console.log(".then ~ error :- ", error);
        throw error;
    });
