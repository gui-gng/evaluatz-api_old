# Evaluatz API

In the project directory, you can run:

### `https://api.evaluatz.com`

API main page
Shows the api version

### Auth

#### `https://api.evaluatz.com/auth/classic`

Uses the authentication with username and password
returns the token

#### `https://api.evaluatz.com/auth/google`

Uses the authentication with google 
returns the token

#### `https://api.evaluatz.com/auth/github`

Uses the authentication with github 
returns the token

#### `https://api.evaluatz.com/auth/getGoogleAuthLink`

returns the link for google auth

### Signup

#### `https://api.evaluatz.com/signup/classic`

Receive the data and create a new user
##### Params
username 
firstname
lastname
email
password



### Get Data

**All this links require a token provided on header:
`x-access-token or authorization`


#### `https://api.evaluatz.com/user`

Return user


