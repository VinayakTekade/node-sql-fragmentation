const Sequelize = require('sequelize');
const crypto = require('crypto');

// Function to encrypt sensitive data
function encrypt(text) {
  const cipher = crypto.createCipher('aes-256-cbc', 'encryption-secret-key');
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt sensitive data
function decrypt(text) {
  const decipher = crypto.createDecipher('aes-256-cbc', 'encryption-secret-key');
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Define Sequelize models for the three databases
const ConfigDatabase = new Sequelize('config_database', 'username', 'password', {
  host: 'config-database-host',
  dialect: 'mysql',
});

const Database1 = new Sequelize({
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
});

const Database2 = new Sequelize({
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
});

// Define models for the configuration database
const ConnectionString = ConfigDatabase.define('ConnectionString', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  connection_string: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Function to retrieve the encrypted connection string from the configuration database
async function getConnectionStrings() {
  try {
    const connectionStrings = await ConnectionString.findAll();
    return connectionStrings.map(({ name, connection_string }) => ({
      name,
      connection_string: decrypt(connection_string),
    }));
  } catch (error) {
    console.error('Error retrieving connection strings:', error);
    throw error;
  }
}

// Function to connect to the specified database using Sequelize
async function connectToDatabase(connectionInfo) {
  try {
    const sequelize = new Sequelize(connectionInfo.connection_string);

    // Test the connection
    await sequelize.authenticate();

    console.log(`Connected to database '${connectionInfo.name}' successfully`);
    return sequelize;
  } catch (error) {
    console.error(`Error connecting to database '${connectionInfo.name}':`, error);
    throw error;
  }
}

// Main function to connect to the three databases
async function main() {
  try {
    // Connect to the configuration database
    await ConfigDatabase.authenticate();
    console.log('Connected to configuration database successfully');

    // Get connection strings from the configuration database
    const connectionStrings = await getConnectionStrings();

    // Connect to the other two databases using the retrieved connection strings
    const [database1, database2] = await Promise.all(
      connectionStrings.map(connectToDatabase)
    );

    // Use database1 and database2 for your application logic
    // ...

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();
