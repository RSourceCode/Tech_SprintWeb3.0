// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // In this case, we use the deployer as the owner.
    const ownerAddress = deployer.address;

    // We'll leave the player address to be set dynamically later in the frontend
    // during contract interaction.
    const playerAddress = "0x0000000000000000000000000000000000000000"; // Placeholder

    const CoinFlip = await ethers.getContractFactory("Coin_Flip");
    const coinFlip = await CoinFlip.deploy(ownerAddress, playerAddress);

    await coinFlip.deployed();

    console.log("Coin_Flip deployed to:", coinFlip.address);
    console.log("Owner address:", ownerAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
