 - `Access Token` - short lived token (has a near expiration date). This should have all the information a request needs to access a resource (roles, is valid, etc)
 - `Refresh Token` - everything needed to _get a new access token_, this should still not have an PII, but will be the check on whether this is a valid refresh token to renew

 ## Workflow

### First sign on
```
User Logins in via the `/authenticate` endpoint
 - Auth Service checks credentials and issues an `access token` AND a `refresh token`
 - 

```

This implementation will allow for the `access token` to have information on it (direct authorization)