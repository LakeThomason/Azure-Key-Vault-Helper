# post_auth_helper

## Description

Just a nice lil helper for interfacing with the auth_server_ts
Currently provides functionality for Client ID / Client Secret authorization

## Installation

`npm post_auth_helper`

## Usage

```javascript
import { ClientIDClientSecretAuth } from "post_auth_helper";
// Mock args
const client_id = "My_Client_ID";
const client_secret = "secret 2kj4h2k3j4h2l3kj4hg";
const authAPI = "https://www.myAuthServer.net";
const idSecretAuth = new ClientIDClientSecretAuth(authAPI);

// Initialize and get token
idSecretAuth
  .authorize()
  .then(() => {
    return idSecretAuth.getToken();
  })
  .then(token => {
    console.log(`Token: ${token}`);
    // Do something with token
  })
  .catch(error => {
    console.log(error);
  });
```

## Subsequent uses

```javascript
idSecretAuth.getToken().then(token => {
  // Do something with token
});
```
