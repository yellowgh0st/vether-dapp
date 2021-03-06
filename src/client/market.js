import axios from 'axios'
import Web3 from 'web3';
import { vetherAddr, vetherAbi, infuraAPI } from './web3.js'

export const getETHPrice = async () => {
    const ethPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    return ethPrice.data.ethereum.usd
}

export const getETHValueInUSD = async (eth) => {
    const ethPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    return ethPrice.data.ethereum.usd * eth
}

const getContract = () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
    const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
   return contract
}

export const getVETHPriceInEth = async (contract) => {
    // var contract
    if(!contract){
        contract = getContract()
    }
    const totalSupply = 1000000*10**18
    const balance = await contract.methods.balanceOf(vetherAddr()).call()

    const totalFees = await contract.methods.totalFees().call()
    const totalEmitted = +totalSupply - +balance + +totalFees

    const day = await contract.methods.currentDay().call()
    const era = await contract.methods.currentEra().call()
    const currentBurn = await contract.methods.mapEraDay_UnitsRemaining(era, day).call()
    const totalBurnt = await contract.methods.totalBurnt().call()
    return ((totalBurnt - currentBurn) / totalEmitted)
}

export const getShare = async (part) => {
    const contract = getContract()
    const day = await contract.methods.currentDay().call()
    const era = await contract.methods.currentEra().call()
    const currentBurn = (await contract.methods.mapEraDay_UnitsRemaining(era, day).call())/(10**18)
    const total = +part + +currentBurn;
    const emission = (await contract.methods.emission().call())/(10**18)
    return ((emission * part) / total)
}

export const getDailyPriceEth = async () => {
    const contract = getContract()
    const day = await contract.methods.currentDay().call()
    const era = await contract.methods.currentEra().call()
    const currentBurn = await contract.methods.mapEraDay_UnitsRemaining(era, day).call()
    const emission = await contract.methods.emission().call()
    return (currentBurn / emission)
}

export const getVETHValueInUSD = async (veth) => {
    const contract = getContract()
    const vethPrice = getVETHPriceInEth(contract)
    const ethPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    console.log(+vethPrice, +ethPrice, +veth)
    return +vethPrice * +ethPrice * +veth
}

export const getVETHValueInETH = async (veth) => {
    const contract = getContract()
    const vethPrice = getVETHPriceInEth(contract)
    return vethPrice * veth
}

export const getGasPrice = async () => {
    const response = await axios.get("https://ethgasstation.info/json/ethgasAPI.json")
    const gasValue = ((response.data.fast/10) * 10**9) * 100000
    // console.log(response, gasValue)
    return gasValue / (10**18)
}