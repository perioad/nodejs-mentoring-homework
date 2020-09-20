import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = 'do not tell anybody';

export default {
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  jwtSecret,
}
