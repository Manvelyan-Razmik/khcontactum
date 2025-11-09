// import pg from "pg";

// import dotenv from "dotenv";

// dotenv.config();
// const { Pool } = pg;

// export const pool = new Pool({
//   host: process.env.PG_HOST,
//   port: Number(process.env.PG_PORT || 5432),
//   database: process.env.PG_DB,
//   user: process.env.PG_USER,
//   password: process.env.PG_PASSWORD,
//   ssl: {
//     rejectUnauthorized: false, // ⚠️ Render-ի համար պարտադիր է
//   },
// });


// server/src/db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "?sslmode=require", // 🟢 սա ավելացրու
  ssl: {
    rejectUnauthorized: false, // 🟢 սա թող մնա
  },
});

