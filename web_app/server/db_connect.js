const mongoose = require('mongoose');

// const username = "weekfouruser";
// const password = "weekfourpass";
// const cluster = "weekfourcluster";
// const dbname = "weekfourdatabase";

const connectDB = () => {
	mongoose.connect(`mongodb+srv://weekfouruser:weekfourpass@weekfourcluster.vgf8ged.mongodb.net/weekfourdatabase`);

	const db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error: "));
	db.once("open", function () {
		console.log("Connected successfully");
	});
}

module.exports = connectDB