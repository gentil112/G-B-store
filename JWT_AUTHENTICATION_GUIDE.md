# JWT Authentication & Protected Routes Implementation Guide

## Overview

This project implements JWT (JSON Web Token) authentication with protected routes for secure user access to the clothing brand website.

## Backend Setup

### Environment Variables (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clothing-brand
JWT_SECRET=your_super_secret_jwt_key_here_change_this
GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Key Backend Files

#### 1. **authMiddleware.js** - Token Verification

- Located at: `backend/middleware/authMiddleware.js`
- Verifies JWT tokens from the Authorization header
- Format: `Authorization: Bearer <token>`
- Returns 401 if token is invalid or expired

#### 2. **authController.js** - Authentication Logic

- Located at: `backend/controllers/authController.js`
- Handles user registration, login, and token generation
- Generates JWT tokens with 7-day expiration
- Returns token on successful login

#### 3. **authRoutes.js** - API Endpoints

- Located at: `backend/routes/authRoutes.js`
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login and get JWT token
- GET `/auth/me` - Get current user (protected)

## Frontend Setup

### 1. AuthContext.jsx

Located at: `src/context/AuthContext.jsx`

Provides authentication state management:

- `user` - Current logged-in user
- `token` - JWT token
- `isAuthenticated` - Boolean flag
- `login()` - Login user and store token
- `logout()` - Logout user and clear token

### 2. useApi Hook

Located at: `src/hooks/useApi.js`

Provides API utilities with automatic token injection:

```javascript
const { get, post, put, delete } = useApi();

// Protected API call
const data = await get('/protected-endpoint', true);
```

### 3. ProtectedRoute Component

Located at: `src/components/ProtectedRoute.jsx`

Wraps routes that require authentication:

```javascript
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### 4. Navbar Integration

The Navbar component is updated to:

- Show user name when logged in
- Display logout button for authenticated users
- Show login/register buttons for unauthenticated users
- Automatically reflect auth state changes

## Usage Examples

### Login Users

```javascript
import { useAuth } from "./context/AuthContext";
import { apiCall } from "./hooks/useApi";

const LoginComponent = () => {
  const { login } = useAuth();

  const handleLogin = async (email, password) => {
    const data = await apiCall("/auth/login", "POST", { email, password });
    login(data.user, data.token);
  };

  return <div>Login Form</div>;
};
```

### Protected API Calls

```javascript
import { useAuth } from "./context/AuthContext";
import { useApi } from "./hooks/useApi";

const UserDashboard = () => {
  const { token } = useAuth();
  const api = useApi();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await api.get("/user/profile", true);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUserData();
  }, [token]);

  return <div>User Dashboard</div>;
};
```

### Protected Routes

```javascript
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

<Routes>
  <Route path="/" element={<Home />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>;
```

## Token Storage

- Tokens are stored in `localStorage` with key: `authToken`
- User data is stored in `localStorage` with key: `user`
- Tokens persist across browser refreshes
- Tokens are automatically cleared on logout

## Token Expiration

- JWT tokens expire after 7 days
- Implement token refresh logic for better UX (optional)
- Failed requests with 401 status indicate expired token

## Security Considerations

1. **Never log tokens to console in production**
2. **Always use HTTPS in production** for token transmission
3. **Set JWT_SECRET to a strong, random value**
4. **Implement token refresh mechanism** for long sessions
5. **Add logout on token expiration** detection
6. **Validate tokens on backend** for all protected routes

## Backend Protected Routes Example

```javascript
// Add this to any route that requires authentication
const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Protected route
router.get("/user-profile", protect, (req, res) => {
  // req.user contains decoded token data
  res.json({ message: "User data", userId: req.user.id });
});

module.exports = router;
```

## Troubleshooting

### "Not authorized. No token provided."

- User is not logged in
- Token is not being sent in Authorization header

### "Not authorized. Invalid or expired token."

- Token has expired (7 days)
- Token was tampered with
- JWT_SECRET doesn't match on backend

### Token not persisting

- localStorage is disabled in browser
- Private/Incognito mode clears storage on close

## Future Enhancements

1. Implement token refresh mechanism
2. Add role-based access control (RBAC)
3. Implement remember me functionality
4. Add OAuth2 social login
5. Add two-factor authentication
6. Implement session timeout warnings
