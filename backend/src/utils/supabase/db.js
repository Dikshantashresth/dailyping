import { Pool } from 'pg';
const clientPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
export default clientPool;
//# sourceMappingURL=db.js.map