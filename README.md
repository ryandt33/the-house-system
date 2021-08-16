# Houses

The House System is an open source app that started as a project to learn React. It turned into a valuable application that can be used by schools to manage a large scale house system easily.

_Features_

- Fully integrated with the ManageBac API - it will import students, teachers and classes when it starts, and can be easily synced with the MB platform
- Custom houses - create as many houses as you like
- Flexible point categories - create your own point categories and edit them on the fly - this makes it easy to hold contests, promote certain behaviours and more
- Class toolbox - enjoy conveniences like a group maker and a random student selector, baked right into the platform
- Admin settings - the platform is easy to administer through the included admin dashboard

_Installation_
OS:
Recommended - Ubuntu 20.04

Required Software:

- Git
- Node (14+)
- Mongo 4+

<u>Installation:</u>
Clone into the repo:

```
git clone
```

Move into the directory:

```
cd the-house-system
```

Copy default.json.sample to default.json

```
cp ./config/default.json.sample ./config/default.json
```

Edit default.json with your organization's details. <i>Note, LL means Learning Locker, if you do not have an LRS using Bearer authentication, set this to false</i>.

<b>A mailgun account is required for emails (for setting/resetting passwords)</b>

Install the umbrella app dependencies:

```
npm i
```

Install the server app dependencies:

```
cd srv
npm i
```

Install the client app dependencies (issue with NPM 14 requires the use of yarn)

```
cd ../client
npm i
```

Setup the runtime-config.js file. (./client/public/runtime-config.js)

```
cp ./client/public/runtime-config-default.js ./client/public/runtime-config.js
```

Put in your API endpoint details:

```
window["runConfig"] = {
  apiURL: "https://houses-api.example.com",
};
```

Build the client and install serve (if necessary)

```
npm run build
sudo npm i -g serve
```

Start the server

```
cd ../
npm run production
```

Complete the initial installation by completing the prompts.
<b>It is important that you create all your houses now - you can reassign students later, but it is made purposefully inconvinient to add new houses at the moment.</b>

## Recommended

Install Nginx on your system

```
sudo apt install nginx
```

Setup a reverse proxy with your website info.

```
server {

    server_name     houses.example.com;

    location / {
            proxy_pass http://127.0.0.1:5000;
    }
}
```

Setup a reverse proxy with your API info

```
server {

    server_name     houses-api.example.com;

    location / {
            proxy_pass http://127.0.0.1:5000;
    }
}
```

Install <a href="https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx.html">certbot</a> and configure SSL certificates for your domain.

```
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d houses.example.com -d house-api.example.com
```

_To-Do_

- Upload students/teachers/classes by CSV
- Allow tracking by homeroom as well as houses
- Make the admin portal responsive
