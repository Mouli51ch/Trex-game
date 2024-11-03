import { ethers } from 'ethers';
import TrexGamePaymentABI from '../../artifacts/contracts/TrexGamePayment.sol/TrexGamePayment.json';

const GAME_CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace with your contract address
const AIA_TOKEN_ADDRESS = "0x70645091201a0019c7fe869e82366a7df6a4206a";

export class GameContractManager {
    private provider: ethers.providers.Web3Provider;
    private signer: ethers.Signer | null = null;
    private gameContract: ethers.Contract | null = null;
    private aiaToken: ethers.Contract | null = null;

    constructor(provider: ethers.providers.Web3Provider) {
        this.provider = provider;
    }

    async initialize(address: string) {
        try {
            this.signer = this.provider.getSigner(address);
            
            // Initialize contracts with signer
            this.gameContract = new ethers.Contract(
                GAME_CONTRACT_ADDRESS,
                TrexGamePaymentABI.abi,
                this.signer
            );
            
            this.aiaToken = new ethers.Contract(
                AIA_TOKEN_ADDRESS,
                [
                    "function balanceOf(address owner) view returns (uint256)",
                    "function approve(address spender, uint256 value) returns (bool)",
                    "function allowance(address owner, address spender) view returns (uint256)",
                ],
                this.signer
            );
        } catch (error) {
            console.error("Failed to initialize contracts:", error);
            throw error;
        }
    }

    async getPlayerStats() {
        if (!this.gameContract || !this.signer) throw new Error("Contract not initialized");
        const address = await this.signer.getAddress();
        const stats = await this.gameContract.getPlayerStats(address);
        return {
            credits: stats.credits.toNumber(),
            gamesPlayed: stats.gamesPlayed.toNumber(),
            highScore: stats.highScore.toNumber(),
            totalSpent: ethers.utils.formatEther(stats.totalSpent),
            hasPlayedBefore: stats.hasPlayedBefore
        };
    }

    async purchaseCredits(numberOfCredits: number) {
        if (!this.gameContract || !this.aiaToken || !this.signer) {
            throw new Error("Contract not initialized");
        }

        const gamePrice = await this.gameContract.gamePrice();
        const totalCost = gamePrice.mul(numberOfCredits);

        // Check allowance
        const address = await this.signer.getAddress();
        const allowance = await this.aiaToken.allowance(address, GAME_CONTRACT_ADDRESS);
        
        if (allowance.lt(totalCost)) {
            const approveTx = await this.aiaToken.approve(
                GAME_CONTRACT_ADDRESS,
                totalCost
            );
            await approveTx.wait();
        }

        const purchaseTx = await this.gameContract.purchaseCredits(numberOfCredits);
        await purchaseTx.wait();
        return true;
    }

    async startGame() {
        if (!this.gameContract) throw new Error("Contract not initialized");
        const tx = await this.gameContract.startGame();
        const receipt = await tx.wait();
        
        const event = receipt.events?.find((e: any) => e.event === 'GameStarted');
        return event ? event.args.gameId.toNumber() : null;
    }

    async endGame(gameId: number, score: number) {
        if (!this.gameContract) throw new Error("Contract not initialized");
        const tx = await this.gameContract.endGame(gameId, score);
        await tx.wait();
        return true;
    }

    async getBalance() {
        if (!this.aiaToken || !this.signer) throw new Error("Contract not initialized");
        const address = await this.signer.getAddress();
        const balance = await this.aiaToken.balanceOf(address);
        return ethers.utils.formatEther(balance);
    }

    async getGamePrice() {
        if (!this.gameContract) throw new Error("Contract not initialized");
        const price = await this.gameContract.gamePrice();
        return ethers.utils.formatEther(price);
    }
}