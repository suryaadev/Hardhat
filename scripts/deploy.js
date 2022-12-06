// imports
// 0xCb9493bAE5637a2Cb833F5Fb33549310d6676f8e
const {ethers, run, network} = require("hardhat")
require("dotenv").config()
// async main

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("deployling contract ....")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`Deployed contract to ::::: ${simpleStorage.address}`)
    // console.log(network.config)

    if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY){
      await simpleStorage.deployTransaction.wait(6)
      await verify(simpleStorage.address,[])
    }

    // get value from contract

    const currentValue = await simpleStorage.retrieve()
    console.log(`current value is :::::: ${currentValue}`)

    // update contract var value

    const transactionResponse = await simpleStorage.store(1760)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value ::::: ${updatedValue}`)
}

// automatically verify contract in etherscan
async function verify(contractAddress, args){

  console.log("Verifying contract :::::::::")
  try {
    await run("verify:verify",{
      address : contractAddress,
      constructorArguments : args
    })
  } catch (e) {
    if(e.message.toLowerCase().includes("already verified")){
      console.log("Already Verified !!!")
    }else{
      console.log(e)
    }
  }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
