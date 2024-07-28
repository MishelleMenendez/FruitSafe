require("dotenv").config();
const app=require("./server");
const connectDB=require("./db/database");
const bodyParser = require("body-parser");
const frutaRoutes = require("./routes/frutas.routes");
const cors=require("cors");
connectDB();
app.use(cors());

app.use(bodyParser.json());
app.use("/api/v1", frutaRoutes);

const PORT=process.env.PORT||3000
app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
});