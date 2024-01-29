import { randomBytes, createCipheriv, createDecipheriv, publicEncrypt, privateDecrypt } from "crypto";

// Encrypt the data passed in using AES-256-CBC algorithm
// Sample input: { "name": "John Doe", "age": 30 }
// Sample output: {
//     "encryptedData": {
//         "iv": "00948389a6120ce46baceb2ecdf68bf5",
//         "encryptedData": "14aa3793c8b661d45f7f008555c009b0e26f2446f414e9580f94c7848311260d"
//     }
// }
function encrypt(data, encryptionAlgorithm, inputEncoding, outputEncoding) {
	// Generate a random IV (Initialization Vector) for each encryption
	const iv = randomBytes(16);

	// Create a new cipher using the secret key
	const cipher = createCipheriv(
		encryptionAlgorithm,
		Buffer.from(process.env.SECRET_KEY),
		iv
	);

	// Encrypt the data passed in
	let encrypted = cipher.update(
		JSON.stringify(data),
		inputEncoding,
		outputEncoding
	);

	// Indicate that we are done with the encryption
	encrypted += cipher.final(outputEncoding);
	return {
		iv: iv.toString(outputEncoding), // Convert IV to string and include it in the output for decryption later
		encryptedData: encrypted,
	};
}

// Decrypt the data passed in using AES-256-CBC algorithm
// Sample input: {
//     "encryptedData": {
//         "iv": "00948389a6120ce46baceb2ecdf68bf5",
//         "encryptedData": "14aa3793c8b661d45f7f008555c009b0e26f2446f414e9580f94c7848311260d"
//     }
// }
// Sample output: { "name": "John Doe", "age": 30 }
function decrypt(
	encryptedData,
	encryptionAlgorithm,
	inputEncoding,
	outputEncoding
) {
	// Create a decipher using the secret key and the IV we generated earlier
	const decipher = createDecipheriv(
		encryptionAlgorithm,
		Buffer.from(process.env.SECRET_KEY),
		Buffer.from(encryptedData.iv, inputEncoding)
	);

	// Decrypt the data passed in
	let decrypted = decipher.update(
		encryptedData.encryptedData,
		inputEncoding,
		outputEncoding
	);

	// Indicate that we are done with the decryption
	decrypted += decipher.final(outputEncoding);

	// Parse the decrypted data to JSON format
	return JSON.parse(decrypted);
}

function encryptUsingPublicKey(data, inputEncoding, outputEncoding) {
	// Encrypt the data using the public key
	const encryptedData = publicEncrypt(
		process.env.PUBLIC_KEY,
		Buffer.from(JSON.stringify(data), inputEncoding)
	);

	// Convert the encrypted data to Base64 for safe representation
	const EncodedEncryptedData = encryptedData.toString(outputEncoding);
	console.log("Encrypted Data:", EncodedEncryptedData);

	return EncodedEncryptedData;
}

function decryptUsingPrivateKey(data, inputEncoding, outputEncoding) {
	// Decrypt the data using the private key
	const decryptedData = privateDecrypt(
		process.env.PRIVATE_KEY,
		Buffer.from(data, inputEncoding)
	);

	// Convert the decrypted data to UTF8 format
	const encodedDecryptedData = decryptedData.toString(outputEncoding);

	return JSON.parse(encodedDecryptedData);
}

export default {
	encrypt,
	decrypt,
	encryptUsingPublicKey,
	decryptUsingPrivateKey,
};