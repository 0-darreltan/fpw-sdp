Seed script for backend (MongoDB + Mongoose)

Files added:
- models/*.js : Mongoose models for User, Product, Project, Order, RAB, Proposal
- seed.js : seeder script that inserts initial mock data
- .env.example : example environment file

How to use
1. Install dependencies (run inside `backend` folder):

```powershell
npm install mongoose dotenv bcrypt
```

2. Copy `.env.example` to `.env` and fill `MONGO_URI` with your MongoDB Atlas connection string.

3. Run the seeder:

```powershell
node seed.js
```

Notes
- Passwords from the mock data are hashed with bcrypt.
- The seeder clears the collections before inserting initial data. Use with caution if you have production data.
- If you prefer, add a script to `backend/package.json`:

```json
"scripts": {
  "seed": "node seed.js"
}
```

Then run `npm run seed`.
