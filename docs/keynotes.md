# Keynotes

## DevOps

- apphosting.yaml rules everything about deployment
- whenever a new commit is pushed to master branch, the deployment is executed
- a JSON object should be stored in one line to get it work with JSON.parse() easier

## Authentication

cookie
  - is applied to protect Next frontend app and backend api internally
  - is also used to protect app main routes

firebaseToken
  - is used as the JWT token for the requests between Next app and backend APIs
  - firebaseToken would be validated on the API server side
  - jose is only used to encrypt token stored in the cookie
  - firebaseToken is used in next frontend/backend internally
