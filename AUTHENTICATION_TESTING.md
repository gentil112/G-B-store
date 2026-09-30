# Authentication Testing Guide

## Test Login Flow

### Step 1: Check if Backend is Running

```bash
# In backend directory
node server.js
# Should show: Server running on port 5000
```

### Step 2: Test Registration

1. Click "Account" → "Register" in navbar
2. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
3. Click Register
4. Should show success message: "Welcome Test User! Please login to continue."
5. Modal should switch to Login mode automatically

### Step 3: Test Login

1. Click "Account" → "Login"
2. Fill in:
   - Email: "test@example.com"
   - Password: "password123"
3. Click Login
4. Should see:
   - Success message: "Welcome back Test User!"
   - Modal closes after 1 second
   - Navbar Account button shows "U" on mobile / "Test User" on desktop
   - Dropdown shows user email and Logout button

### Step 4: Test Logout

1. Click Account dropdown
2. Click "Logout"
3. Should see:
   - Account button back to "A/C" / "Account"
   - Dropdown shows Login/Register buttons

---

## Debugging Checklist

If login doesn't work:

- [ ] Backend is running on port 5000
- [ ] Check browser console for errors (F12)
- [ ] Verify `.env` file exists in backend folder
- [ ] Check MongoDB connection is working
- [ ] API call is using correct endpoint: `/auth/login`
- [ ] Response includes `token` and `user` fields

### Expected API Response on Successful Login:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### Check localStorage:

Open DevTools → Application → Local Storage:

- `authToken` - Should contain JWT token
- `user` - Should contain user object

---

## Common Issues

**Issue: Modal doesn't open after clicking Login**

- Solution: Check that `openAuthModal` is being called properly

**Issue: After login, navbar doesn't update**

- Solution: Make sure login() is called from useAuth hook
- Check that isAuthenticated state is being set to true
- Verify localStorage is working

**Issue: Logout doesn't work**

- Solution: Check that logout() is being called
- Verify token is removed from localStorage
- Check context state updates

---

## Browser DevTools Testing

### Console Tests:

```javascript
// Check if AuthProvider is working
localStorage.getItem("authToken"); // Should show token after login

// Check context directly
// (Install React Developer Tools extension to inspect context)
```

### Network Tab:

1. Open DevTools → Network tab
2. Try to login
3. Look for POST request to `/auth/login`
4. Check response status (should be 200)
5. Check response body contains token and user data

---

## MongoDB Database Verification

Check if user was created:

```bash
# Connect to MongoDB
mongodb

# Use clothing-brand database
use clothing-brand

# Find users
db.users.find()

# Should show something like:
{
  "_id": ObjectId("..."),
  "name": "Test User",
  "email": "test@example.com",
  "password": "$2a$10$..." (hashed)
}
```
