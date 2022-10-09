import { PrismaClient } from '@prisma/client'

const run = async () => {
    const prisma = new PrismaClient()
    try {
        if ((await prisma.user.count()) === 0) {
            await prisma.user.create({
                data: {
                    id: '96f3a628-d0f4-46eb-b212-b88738db72dd',
                    firstName: 'Mike',
                    surname: 'McAvoy',
                    email: 'mike@test.com',
                },
            })
        } else {
            console.log('Default user already created')
        }
    } finally {
        await prisma.$disconnect()
    }
}

run()
