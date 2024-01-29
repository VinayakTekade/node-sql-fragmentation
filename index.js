import {
	getDb,
	getConnectionStrings,
	connectToDatabase,
} from "./utils/sequelize-lib";

// Define Sequelize models
const commonDatabase = new getDb(
	"config_database",
	"config-database-host",
	"username",
	"password"
);

// Main function to connect to the all databases
async function main() {
	try {
		// Connect to the configuration database
		await commonDatabase.authenticate();
		console.log("Connected to configuration database successfully");

		// Get connection strings from the configuration database
		const connectionStrings = await getConnectionStrings();

		// Connect to the other two databases using the retrieved connection strings
		const [database1, database2] = await Promise.all(
			connectionStrings.map((connectionInfo) => {
				connectToDatabase(connectionInfo);
			})
		);

		// Use database1 and database2 for your application logic
		// ...
	} catch (error) {
		console.error("Error:", error);
	}
}

// Run the main function
main();
