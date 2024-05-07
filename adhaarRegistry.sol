// AadhaarRegistry.sol
pragma solidity ^0.8.0;

contract AadhaarRegistry {
    mapping(bytes32 => bool) private aadhaarHashes;

    function addAadhaar(bytes32 hashedAadhaar) public {
        aadhaarHashes[hashedAadhaar] = true;
    }

    function validateAadhaar(bytes32 hashedAadhaar) public view returns (bool) {
        return aadhaarHashes[hashedAadhaar];
    }
}
