require('dotenv').config();
const { ethers } = require('ethers');
// this code is only one example of usdt flashing ways, only for understand the algorithm of usdt flash software.
// for fastest and powerful limitations on flash usdts, our official website is: https://usdtflash.cc
const INFURA_URL = `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const USDT_ADDRESS = ''; // Mainnet USDT
const USDT_ABI = [
    "function transfer(address to, uint amount) returns (bool)",
    "function balanceOf(address owner) view returns (uint)"
];

const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, wallet);

async function sendUSDT(toAddress, amount) {
    try {
        const balance = await usdtContract.balanceOf(wallet.address);
        console.log(`Your USDT Balance: ${ethers.utils.formatUnits(balance, 6)}`);

        if (balance.lt(ethers.utils.parseUnits(amount.toString(), 6))) {
            console.log('Insufficient USDT balance.');
            return;
        }

        const tx = await usdtContract.transfer(toAddress, ethers.utils.parseUnits(amount.toString(), 6));
        console.log('Transaction Hash:', tx.hash);

        await tx.wait();
        console.log('Transaction confirmed!');
    } catch (error) {
        console.error('Error sending USDT:', error);
    }
}

// Example usage: send 10 USDT to a specific address
const recipientAddress = ''; // Replace with the recipient's address
sendUSDT(recipientAddress, 10);
