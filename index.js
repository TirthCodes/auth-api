import dotenv from 'dotenv';
import express from 'express'       

dotenv.config()

const app = express();
const port = process.env.PORT;

app.get("/", (_req, res) => {
  res.send("Hello World!")
})

app.get("/signup", (_req, res) => {
	res.send("Sign Up");
})

app.get("/login", (_req, res) => {
	res.send("Login");
})

app.listen(port, () => { 
	console.log(`Server running on http://localhost:${port} 🚀`);
});