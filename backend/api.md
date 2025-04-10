# `API.md`

```markdown
# Country API Middleware Service

This document outlines the RESTful API endpoints for the Country API Middleware Service. All responses are in JSON format.

---

## Base URL

- **Local**: `http://localhost:3000`
- **Docker**: `http://localhost:3000`

---

### **Authentication Endpoints**
- `POST /auth/register`
- `POST /auth/login`

### **Country Data Endpoints**
- `GET /api/countries`
- `GET /api/countries/:name`

### **Admin Endpoints**
- `GET /admin`
- `POST /admin/keys/generate`
- `POST /admin/keys/:id/revoke`

## Security Notes

- **API Key** required for `/api/*` endpoints and validated per request.
- **JWT** required for `/admin/*` endpoints. Tokens expire after 1 hour.
- **Tracking**: API key usage includes timestamps and usage counts.
- **Logout**: Clear JWT from local storage to end session.
```

---

Let me know if you want this exported as a `.md` file or want a Postman collection too!