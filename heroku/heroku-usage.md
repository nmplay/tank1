herokuの使い方

https://devcenter.heroku.com/

https://devcenter.heroku.com/categories/nodejs

https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction

free Heroku account, 
Node.js and npm installed.


https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up

Heroku Toolbelt

heroku-toolbelt.exe

```
> heroku login
```

https://devcenter.heroku.com/articles/getting-started-with-nodejs#prepare-the-app

https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app

```
> heroku create --http-git

> heroku apps:rename NEWNAME

> heroku keys:add

> git push heroku master
```

https://devcenter.heroku.com/articles/nodejs-support

npm package.json
```
  engines
```

Procfile
```
web: node app.js
```

web: npm start

```
> heroku logs --tail | node -e process.stdin.pipe(process.stdout)

> git push heroku master
```
