const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { assert } = require('chai')

describe('Game5', function () {
	async function deployContractAndSetVariables() {
		const Game = await ethers.getContractFactory('Game5')
		const game = await Game.deploy()

		return { game }
	}
	async function getAddress() {
		const threshold = 0x00ffffffffffffffffffffffffffffffffffffff
		let address = threshold
		while (1) {
			const wallet = ethers.Wallet.createRandom().connect(ethers.provider)
			address = await wallet.getAddress()
			if (address < threshold) {
				return { wallet, address }
			}
		}
	}

	it('should be a winner', async function () {
		const { game } = await loadFixture(deployContractAndSetVariables)
		const { wallet, address } = await getAddress()

		// good luck
		const signer = ethers.provider.getSigner(0)
		await signer.sendTransaction({
			to: address,
			value: ethers.utils.parseEther('1.0'),
		})

		const tx = await game.connect(wallet).win()
		console.log(`Transaction sent from address ${address}...`)
		await tx.wait()
		console.log(`Transaction completed`)
		// leave this assertion as-is
		assert(await game.isWon(), 'You did not win the game')
	})
})
