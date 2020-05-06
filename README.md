# api-proxy
Safely make secret-key-required http requests from flat html sites.

## Setup

**Install dependency packages**

```
npm install 
```

**Add local env file**

```
touch .env.local
```

**Add secret keys to local env file**

```
# .env.local

EXAMPLE_KEY_NAME=examplekeyvalue
FOO_KEYNAME=1234556

```

## Development

```
npm start
```

Starts the google cloud function at
`http://localhost:8000/`


## Usage

From your application, send requests to the api-proxy endpoint.

The local api-proxy url is `http://localhost:8000/` by default. You can change the port in `package.json`

Also include the 2 required query parameters:

`api` <br />
A url encoded string.

`keyNames` <br />
Two dimensional array of key/variables

## Examples

**Example Request**

```
http://localhost:8000?api=https%3A%2F%2Fsome-api-url.com&keyNames=[["keyname", "ENV_VARIABLE_NAME"]]
```

**Full Example**

From your app, build api request url and send to api-proxy.

**In api-proxy** 
```
# .env.local

APP_ID=abc123
APP_SECRET=2957556085278776407

```

**In your app** <br />
(This example uses Axios to send reqeusts to api-proxy)

```
// api-proxy endpoint in local dev
const proxy = http://localhost:8000;

// actual api endpoint
const someAPI = https://api.someservice.com;

const keyNames = '[["app_id", "APP_ID"], ["app_secret", "APP_SECRET"]]'

// api proxy url w/ acutal api and keynames as params
let url = `${proxy}?api=${encodeURIComponent(someAPI)}`
url += `&keyNames=${keyNames}`

// Send request to api proxy
axios.get(url).then((resp) => {
  // Handle response
}).catch((err) => {
  // Handle error
})  
```

## Usage in Production

Once you setup your live service (see below), send requests to the live endpoint. Everything else is the same.

## Production Setup

The following sections assume you're using Google Cloud Functions. You can use any Nodejs environment though.

Follow the Google Cloud Functions [documentation](https://cloud.google.com/functions/docs/writing/http) to create a function in the Nodejs environement.

The basic steps to create a function from the web console are: 

Create a new funciton

Set the "function to run" to `trigger`

Add the contents of `index.js` via copy/paste.

Add the dependencies, which are

```
  {
    "@google-cloud/functions-framework": "^1.5.1",
    "axios": "^0.19.2"
  }
```

Set the needed environment variables, including the additional `origin` variable (see next section).

## Production Environment Variables

Working off the full example above, the service would require 3 variables:
`APP_ID` and `APP_SECRET`. 

And a third, production-only variable to restrict incoming requests to only your app.

The variable name shoul be `ORIGIN`
and value is your app's production url.

You only have to set these variables once.

## Deployment

There are [several options](https://cloud.google.com/functions/docs/deploying) for deploying.
If you're just starting w/ google cloud, the fastest way is to copy/paste in the web console.