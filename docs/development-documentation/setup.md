# The project and Linux environments
To host the project on a linux environment, follow each section for each component of the application.

This guide is assuming a Ubuntu linux environment, for other distros, follow guide using commands for the respective distro.

## Frontend
Install apache and dependancies:

`sudo apt install apache2`

Move the `frontend/build` folder into the following directory, `/var/www/`.

Change the apache default directory to the build folder. Using your editor of choice (e.g. Vim, Nano).\
Edit the following file:

`/etc/apache2/sites-available/000-default.conf`

change the line `DocumentRoot /var/www/html` to point to the build directory (i.e. `DocumentRoot /var/www/build`)

You should also edit the directory in the file `/etc/apache2/apache2.conf` to point to the build directory.

Run the following command: `sudo service apache2 start`

The frontend setup is complete and should be running on default port 80.

## Database API
Assuming `npm` is installed, install pm2 the process manager for node.js, run the following command:

`npm install pm2@latest -g` - If you get errors because npm isnt a command, install npm.

Place the `/src/database-api/` folder in a location of your choosing, ideally somewhere you wont forget.

Change the directory into the `database-api` folder (i.e. `cd lab-allocator/src/database-api`)

Run the following command:

`pm2 start --name database-api npm -- start`

The database API should now be running as its own process.

## Database
Install `mongodb`. Ensure that `mogod` (MongoDB) is enabled as a service that will run on startup:\
`sudo systemctl status mongod` - Check if the service is enabled.\
`sudo systemctl enable mongod` - Enable MongoDB to start on boot.

Enter the mongo shell using `mongosh`.

Create a laballocator database using the command `use laballocator`.

Create three collections using the following commands:\
`db.createCollection(courses)`\
`db.createCollection(timetables)`\
`db.createCollection(tokens)`

The database should now be running as its own service.


## Algorithm