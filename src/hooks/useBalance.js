import { useContext } from "react"
import { BlockchainContext } from "../App"

const useBalance = (address) => {
    const { blocks } = useContext(BlockchainContext)

    const getBalance = () => {
        const txs = blocks.map(({ transactions }) => transactions.filter(tx => (tx.from === address || tx.to === address))).flat()

        const credits = txs.filter(tx => tx.to === address).reduce((acc, value) => acc + Number(value.amount), 0)
        const debits = txs.filter(tx => tx.from === address).reduce((acc, value) => acc + Number(value.amount), 0)

        return credits - debits
    }

    return {
        getBalance
    }
}

export default useBalance