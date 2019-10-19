# Evaluatz API


### `https://api.evaluatz.com`

API main page
Shows the api version

## Auth

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

## Signup

#### `https://api.evaluatz.com/signup/classic`

Receive the data and create a new user
##### Params
- username 
- firstname
- lastname
- email
- password



## Get Data

**All this links require a token provided on header:**
`x-access-token` or `authorization`

## User
#### `https://api.evaluatz.com/user`
Return user

#### `https://api.evaluatz.com/user/balance`
Return user balance

#### `https://api.evaluatz.com/user/transactions`
Return user transactions


## Project
#### `https://api.evaluatz.com/create`
Create project
##### Params
- name 

#### `https://api.evaluatz.com/project/:id`
Return project

#### `https://api.evaluatz.com/project/:id/balance`
Return project balance

#### `https://api.evaluatz.com/project/:id/transactions`
Return project transactions


## Search
#### `https://api.evaluatz.com/search`
Search project
##### Params
- project
- page_num (optional)
- page_length (optional)