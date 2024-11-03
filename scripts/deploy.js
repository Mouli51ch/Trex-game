// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
    try {
        console.log("Starting deployment...");

        // Get network
        const network = await ethers.provider.getNetwork();
        console.log("Network:", {
            name: network.name,
            chainId: network.chainId
        });

        // Get the deployer
        const [deployer] = await ethers.getSigners();
        console.log("Deploying with account:", deployer.address);

        // Get balance
        const balance = await deployer.getBalance();
        console.log("Account balance:", ethers.utils.formatEther(balance));

        // AIA token address (checksummed)
        // Using a different format of the same address
        const AIA_TOKEN_ADDRESS = "0x70645091201a0019c7fe869e82366a7df6a4206a";
        try {
            const checksummedAddress = ethers.utils.getAddress(AIA_TOKEN_ADDRESS.toLowerCase());
            console.log("Using AIA Token Address:", checksummedAddress);

            // Initial game price (0.1 AIA)
            const INITIAL_GAME_PRICE = ethers.utils.parseEther("0.1");
            console.log("Initial game price:", ethers.utils.formatEther(INITIAL_GAME_PRICE), "AIA");

            // Deploy contract
            console.log("\nDeploying TrexGamePayment contract...");
            const TrexGamePayment = await ethers.getContractFactory("TrexGamePayment");
            const trexGame = await TrexGamePayment.deploy(checksummedAddress, INITIAL_GAME_PRICE);

            console.log("Waiting for deployment...");
            await trexGame.deployed();

            console.log("Contract deployed to:", trexGame.address);

            // Save deployment info
            const fs = require("fs");
            const deployInfo = {
                contractAddress: trexGame.address,
                aiaTokenAddress: checksummedAddress,
                deployerAddress: deployer.address,
                deploymentTime: new Date().toISOString(),
                network: {
                    name: network.name,
                    chainId: network.chainId
                },
                initialGamePrice: ethers.utils.formatEther(INITIAL_GAME_PRICE)
            };

            fs.writeFileSync(
                'deployment-info.json',
                JSON.stringify(deployInfo, null, 2)
            );

            console.log("\nDeployment info saved to deployment-info.json");

        } catch (error) {
            if (error.code === "INVALID_ARGUMENT") {
                console.error("Invalid AIA token address format. Please verify the address.");
                console.error("Trying alternative address format...");
                
                // Try alternative AIA token address if available
                const ALTERNATIVE_AIA_ADDRESS = "0x70645091201a0019c7fe869e82366a7df6a4206a";
                const altChecksummedAddress = ethers.utils.getAddress(ALTERNATIVE_AIA_ADDRESS);
                console.log("Using alternative AIA address:", altChecksummedAddress);
                
                // Deploy with alternative address
                const TrexGamePayment = await ethers.getContractFactory("TrexGamePayment");
                const trexGame = await TrexGamePayment.deploy(
                    altChecksummedAddress,
                    ethers.utils.parseEther("0.1")
                );
                
                await trexGame.deployed();
                console.log("Contract deployed successfully with alternative address to:", trexGame.address);
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error("\nDeployment failed!");
        console.error(error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });