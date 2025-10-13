const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const rateRoute = require("./routes/rate")
const cors = require("cors");


app.use(express.json())
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.use("/rate", rateRoute);

