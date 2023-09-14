const hre = require('hardhat');

async function main() {
    const Messaging = await hre.ethers.getContractFactory('Messaging');
    const messaging = await Messaging.deploy();
    await messaging.deployed();
    console.log("Contract Deployed To: ", messaging.address)
}

const runMain = async () => {
    try {
        await main();
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

runMain();