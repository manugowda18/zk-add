// client.js
const Web3 = require('web3');
const { Circuit, groth } = require('snarkjs'); // Example library for ZK proofs
const { soliditySha3 } = require('web3-utils');

// Connect to Ethereum node
const web3 = new Web3('http://localhost:8545');

// Address and ABI of AadhaarRegistry contract
const contractAddress = '0x...';
const contractABI = require('./AadhaarRegistry.json'); // Load contract ABI

// Create contract instance
const aadhaarContract = new web3.eth.Contract(contractABI, contractAddress);

// Function to generate ZK proof
async function generateProof(x, y, z) {
    // Define the circuit
    const circuitDef = {
        "title": "Multiplication Circuit",
        "description": "Prove knowledge of a secret number x such that x * y = z",
        "input": ["field", "field", "field"],
        "components": [
            { "name": "xTimesY", "type": "field", "value": "x * y" },
            { "name": "eqCheck", "type": "boolean", "value": "xTimesY == z" }
        ]
    };

    // Create circuit
    const circuit = new Circuit(circuitDef);

    // Generate witness
    const witness = circuit.calculateWitness({ "x": x, "y": y, "z": z });

    // Generate proof
    const { proof, publicSignals } = await groth.genProof(circuit, witness);

    return { proof, publicSignals };
}

// Function to add Aadhaar to the registry
async function addAadhaar(aadhaarHash) {
    await aadhaarContract.methods.addAadhaar(aadhaarHash).send({ from: '0x...' }); // Use your Ethereum address
    console.log("Aadhaar added to registry");
}

// Function to validate Aadhaar using ZK proof
async function validateAadhaar(aadhaarNumber, proof, publicSignals) {
    const aadhaarHash = soliditySha3(aadhaarNumber);

    // Verify ZK proof on-chain
    const isValid = await aadhaarContract.methods.validateAadhaar(aadhaarHash, proof, publicSignals).call();

    console.log("Aadhaar number is valid:", isValid);
}

// Example usage
async function main() {
    const aadhaarNumber = "123456789012"; // Example Aadhaar number
    const x = 123; // Example secret number
    const y = 456; // Example known number
    const z = x * y; // Result

    // Generate ZK proof
    const { proof, publicSignals } = await generateProof(x, y, z);

    // Add Aadhaar to the registry
    await addAadhaar(soliditySha3(aadhaarNumber));

    // Validate Aadhaar using ZK proof
    await validateAadhaar(aadhaarNumber, proof, publicSignals);
}

main().catch(console.error);
