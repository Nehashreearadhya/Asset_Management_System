const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());


// Authentication
app.use("/api/auth", require("./routes/authRoutes"));


// Asset Management
app.use("/api/asset", require("./routes/assetRoutes"));

//Employee mangement
app.use(
    "/api/employee",
    require("./routes/employeeRoutes")
);

//Assest Management
app.use("/api/assignment", require("./routes/assignmentRoutes"));

//departement
app.use("/api/department", require("./routes/departmentRoutes"));


//dashborad
app.use(
    "/api/dashboard",
    require("./routes/dashboardRoutes")
);


connectDB();


// Test API
app.get("/", (req, res) => {
    res.send("Asset Management System API is running");
});


app.listen(4000, () => {
    console.log("Server running on port 4000");
});

