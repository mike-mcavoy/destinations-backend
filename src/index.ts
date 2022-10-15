import { startServer } from './app'
import { generatePems } from './utils/generatePems'

const PORT = 3001

async function main() {
    await generatePems()

    startServer(PORT)
}

main()
