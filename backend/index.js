const express = require("express");
const analysisRouter = require("./routes/Analysis.router")

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get("/", (req, res) => {
   res.send("HELLO");
})
app.use("/analysis", analysisRouter)
app.listen(3000, () => console.log("Server is listening on port 3000"))