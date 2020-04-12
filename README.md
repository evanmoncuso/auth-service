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

### POST :: `/validate`
Get a new `access token` by checking a `refresh token`

### POST :: `/invalidate`
Provide a refresh token and invalidate that `refresh token`. Destroying that token's usefulness

### POST :: `/refresh`
Provide a token and 
## JWT