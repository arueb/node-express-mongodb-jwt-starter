const express = require("express");
const app = express();

require("./startup/db")();
require("./startup/routes")(app);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Example app listening on port 3000!");
});
