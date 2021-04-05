# lite.fyi

Lite.fyi is a very micro link shortener, with all the clutter taken away. It does what it says it does (shortens links,
duh).  
This service is ready to be deployed out of the box with Netlify, and is designed to work with Netlify (although it
wouldn't be much work porting it elsewhere). If you don't have Netlify insalled, check it out
[here](https://docs.netlify.com/cli/get-started/)

[![Deploy](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/jdleo/lite)

## dev

1. clone

```
git clone git@github.com:jdleo/lite.git
```

2. install dependencies

```
yarn
```

3. add your firebase service account key to a new .env file in root

```
FIREBASE_SERVICE_ACCOUNT=xxxxx
```

After you've made a new Firebase app, enabled Firestore, go to `Settings > Service Accounts` if you're unsure where to
go.

4. start dev server

```
netlify dev
```

## prod (without deploy button)

1. create new netlify app, and set a new environment variable for your site, for `FIREBASE_SERVICE_ACCOUNT`, where its
   equal to the JSON string of your Firebase Service Account key.
2. deploy your site

```
netlify deploy --prod
```

## test

```
yarn run test
```

## build

```
yarn run build
```
