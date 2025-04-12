import { ethers } from "ethers"
import { formatAddress } from "@corposium-defi/common"

export class MyContractSDK {
  private contract: ethers.Contract

  constructor(provider: ethers.Provider, contractAddress: string, abi: any[]) {
    this.contract = new ethers.Contract(contractAddress, abi, provider)
  }

  async setValue(value: number): Promise<void> {
    const signer = await this.contract.getSigner()
    // const tx = await this.contract.connect(signer).setValue(value)
    // await tx.wait()
  }

  async getValue(): Promise<number> {
    return this.contract.value()
  }
}
