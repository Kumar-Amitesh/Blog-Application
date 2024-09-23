# Blog Application

This project is a Blog Application built with **Node.js** and **Express.js**. The primary focus of the application is to demonstrate how user authentication is handled in a web application. It includes basic features like user registration, login, and handling blog posts, although the project is still under development and lacks complete functionality. The frontend has not been developed yet.

## Main Purpose: Handling Authentication

The core functionality of this project revolves around implementing secure user authentication. Below is a detailed explanation of how authentication is handled:

### 1. User Registration
- **Endpoint:** `/api/register`
- **Description:** Allows new users to register by providing a username and password.
- **Implementation:**
  - Passwords are hashed using **bcrypt** before being stored in the database for security.
  - A new user record is created in the database.

### 2. User Login
- **Endpoint:** `/api/login`
- **Description:** Allows registered users to log in by providing their credentials.
- **Implementation:**
  - The user's password is compared with the hashed password stored in the database.
  - Upon successful login, a **JSON Web Token (JWT)** is generated.
  - The JWT is sent back to the user, which they must include in the Authorization header for protected routes.

### 3. JWT Authentication
- **Token Generation:**
  - Upon successful login, a JWT is created using a secret key.
  - The JWT contains the user’s ID and is signed to prevent tampering.
- **Token Storage:**
  - The token is stored on the client side (usually in local storage or cookies) and is sent with every request to protected routes.
- **Token Verification:**
  - For routes that require authentication, the server verifies the JWT sent by the client.
  - If the token is valid, the request proceeds; otherwise, the user receives an "Unauthorized" response.

### 4. Protected Routes
- **Implementation:**
  - Middleware is used to protect routes that require authentication.
  - The middleware checks for the presence of a valid JWT in the Authorization header.
  - If the JWT is valid, the request is allowed to proceed; otherwise, it is blocked.

#### Example of Middleware for Authentication
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access Denied' });
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = authenticateToken;
```

### 5. Logout Functionality
- **Implementation:** 
  - Although the project does not explicitly implement a logout endpoint, the frontend can handle logout by deleting the JWT from storage, thereby preventing further access to protected routes.

## Tech Stack
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (for storing user and blog data)
  - bcrypt (for password hashing)
  - JWT (for authentication)

## Project Structure
```
backend/
├── models/
│   ├── User.js            // User schema
│   ├── Blog.js            // Blog schema
├── app.js                 // Main server file
```

## Incomplete Features
- **Controllers and Routes:**
  - The project currently does not include separate controllers or route files. All logic is managed directly within the `app.js` file.
- **Frontend Development:**
  - The project lacks a frontend interface, which needs to be developed.
- **Blog CRUD Operations:**
  - Basic CRUD operations for blogs are intended but are not yet fully implemented or exposed through separate route files.

## Future Enhancements
- **Complete Frontend:**
  - Develop a React.js frontend to allow users to interact with the backend through a user interface.
- **Role-Based Access Control (RBAC):**
  - Implement role-based access control to restrict access to certain parts of the application.
- **Session Management:**
  - Improve session management by implementing token expiration and refresh mechanisms.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.