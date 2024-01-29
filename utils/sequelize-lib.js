import Sequelize from "sequelize";

export const getDb = (config_database, host, username, password) => {
	return new Sequelize(config_database, username, password, {
		host: host,
		dialect: "mysql",
	});
};

export const createConfigDbModel = (ConfigDatabase) => {
	return ConfigDatabase.define("ConnectionString", {
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		connection_string: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	});
};

export const getConnectionStrings = async (ConnectionString) => {
	try {
		const connectionStrings = await ConnectionString.findAll();
		return connectionStrings.map(({ name, connection_string }) => ({
			name,
			connection_string: decrypt(connection_string),
		}));
	} catch (error) {
		console.error("Error retrieving connection strings:", error);
		throw error;
	}
};

export const connectToDatabase = async (connectionInfo) => {
	try {
		const sequelize = new Sequelize(connectionInfo.connection_string);
		// Test the connection
		await sequelize.authenticate();
		console.log(
			`Connected to database '${connectionInfo.name}' successfully`
		);
		return sequelize;
	} catch (error) {
		console.error(
			`Error connecting to database '${connectionInfo.name}':`,
			error
		);
		throw error;
	}
};
