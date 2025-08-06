const express = require('express');
const path = require('path');
const cors = require('cors');
const  userRoute = require('./Routes/user.routes.js');
const courseRoute = require('./Routes/course.routes.js');
const adminRouter = require('./Routes/admin.route.js');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use("/api/v1/users", userRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/admin", adminRouter);

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(cors());
app.get("/", function (req, res) {
   res.sendFile(__dirname + "/frontend/index.html")
})

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
