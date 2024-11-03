// scripts/verify-deployment.js
const { ethers } = require("hardhat");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    // Read deployment info
    const deploymentPath = path.join(__dirname, "../deployment-info.json");
    if (!fs.existsSync(deploymentPath)) {
      throw new Error("Deployment info not found. Please deploy the contract first.");
    }
    
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    console.log("\nVerifying contract deployment...");
    console.log("Contract address:", deploymentInfo.contractAddress);

    // Connect to the contract
    const TrexGamePayment = await ethers.getContractFactory("TrexGamePayment");
    const trexGame = TrexGamePayment.attach(deploymentInfo.contractAddress);

    // Verify basic contract information
    console.log("\nChecking contract state...");
    
    const gamePrice = await trexGame.gamePrice();
    console.log("Game price:", ethers.formatEther(gamePrice), "AIA");

    const aiaToken = await trexGame.aiaToken();
    console.log("AIA token address:", aiaToken);
    console.log("Matches expected:", aiaToken === deploymentInfo.aiaTokenAddress);

    const owner = await trexGame.owner();
    console.log("Contract owner:", owner);

    const paused = await trexGame.paused();
    console.log("Contract paused:", paused);

    const totalGames = await trexGame.totalGamesPlayed();
    console.log("Total games played:", totalGames.toString());

    const balance = await trexGame.getContractBalance();
    console.log("Contract balance:", ethers.formatEther(balance), "AIA");

    console.log("\nContract verification completed successfully!");

  } catch (error) {
    console.error("\nVerification failed!");
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