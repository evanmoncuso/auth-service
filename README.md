# Authentication Service

## Purpose
This purpose of this service is to authenticate users against the user database. THIS SERVICE DOES NOT CREATE OR MANAGEN USER INFORMATION. 

## Contracts

### `Access Token`
 - *lifespan* - 10 minutes
 - *data* - will include the `user_id`, `username` and a user's `roles`
    ```
    {
      user_id: string (uuid)
      username: string,
      permissions: string[],
    }
    ```

### `Refresh Token`
- *lifespan* - 1 day
- 

## API
### POST :: `/authenticate`
Provide a username and password for a user, receive an authentication token (in the form of a JWT) back


### POST :: `/invalidate`
Provide a refresh token and invalidate that `refresh token`. Destroying that token's usefulness

```json
  // request body
  {
    "refresh_token": "<string>",
  }

  // response body
  // none - 204 RESPONSE CODE
```

### POST :: `/refresh`
Provide a refresh_token and get back a new access_token if everything is okay


```json
  // request body
  {
    "refresh_token": "<original-refresh-token>", 
  }

  // response body
  {
    "access_token": "<new-access-token>",
    "refresh_token": "<original-refresh-token>"
  }
```

## JWT
The JWT contains certain information about the user
