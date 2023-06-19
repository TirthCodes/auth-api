# Authentication API
The Authentication API is a Node.js and Express.js-based API that provides user authentication using JWT (JSON Web Token) authentication and session management. It allows users to sign up, log in, and access protected routes securely.

## Features
- User sign up: Allows users to create a new account by providing a unique email and password.
- User login: Authenticates users by validating their email and password, and generates a JWT token for subsequent authorized requests.
- Protected routes: Includes endpoints that require authentication with a valid JWT token to access.
- JSON Web Token (JWT) authentication: Uses JWT tokens for stateless authentication, providing a secure and efficient mechanism for user verification.
- Secure password handling: Safely stores user passwords by encrypting them using industry-standard hashing algorithms.
- API documentation: Provides clear documentation in the request.http file, describing the available endpoints, request/response formats, and authentication requirements. You need to install **REST Client** extension which I had recommended in the .vscode/extensions.json file

## Prerequisites

- Node.js: Ensure that you have Node.js v18 >= installed on your machine.
- SQLite: The API uses SQLite as the database. No separate installation is required as SQLite is included as a module in Node.js.

## Installation

1. Clone the repository.
2. cd /auth-api
3. Install the dependencies by running `pnpm install`. or using any other package manager.
4. Configure the API settings, such as the database connection and JWT secret, in the `.env` file or environment variables.
5. Run `pnpm dlx prisma migrate dev --name init` to create SQL migration file. If you are using npm use `npx` instead of `pnpm dlx`
6. Start the API by running `pnpm start`.

## Usage

1. Sign up a new user by sending a POST request to the `/signup` endpoint with a unique email and password.
2. Log in with the created user credentials by sending a POST request to the `/login` endpoint. The response will include a JWT token.
3. Access protected routes by including the JWT token in the `Authorization` header of subsequent requests.
4. Use the provided API documentation to explore the available endpoints and their request/response formats.

