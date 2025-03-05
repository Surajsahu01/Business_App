import {app} from "./app.js";
import connectDB from "./DataBase/db.js";


connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})