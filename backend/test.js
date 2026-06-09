const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://kirtideshwal256_db_user:health123@cluster.jqvsqei.mongodb.net/ruralhealth?retryWrites=true&w=majority&appName=Cluster"
)
.then(() => {
  console.log("Connected Successfully");
  process.exit();
})
.catch((err) => {
  console.log("Connection Failed");
  console.log(err);
});