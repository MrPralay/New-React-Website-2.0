import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

let prisma;

const getPrisma = (databaseUrl) => {
    if (!prisma) {
        const pool = new Pool({ connectionString: databaseUrl });
        const adapter = new PrismaNeon(pool);
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
};

export default getPrisma;
