# Database API

All requests for the database should be made to the following link: \
`http://laballoc-dev.cecs.anu.edu.au:3001/api/` followed by more specific URL query parameters.

The current testing API is located in `~/../u6934917/lab-allocator/src/database-api/src` on the dev server.\
You will need to run the API with `npm start` if you are testing it as it is not started by default.

If you are getting errors with npm/npx not existing when ssh'ed into the server, source my bashfile with `sudo source ~/../u6934917/.bashrc`. If that doesnt work, google.

## Get Requests
`http://laballoc-dev.cecs.anu.edu.au:3001/api/data?collection=A&target=B`\
`A` is either `course_data` or `timetable_data`.\
`B` is the course code or timetable creation date (as an integer), whichever you want to get specifically.

Note: Do not include `&target=B` if you do not need to get a specific course or timetable.

## Post Requests
### Uploading Data
`http://laballoc-dev.cecs.anu.edu.au:3001/api/upload?collection=A&bulk=B`\
`A` is either `course_data` or `timetable_data`.\
`B` is either `true` or `false` if lots of data is being uploaded from an array.

The Bulk query parameter should only be used for `course_data` uploads from a file. Otherwise you will only need to specify the collection in which the data is being uploaded to.

### Updating Data
`http://laballoc-dev.cecs.anu.edu.au:3001/api/update?collection=A&target=B`\
`A` is either `course_data` or `timetable_data`.\
`B` is the course code or timetable creation date (as an integer), whichever you want to udpdate.

### Deleting Data
`http://laballoc-dev.cecs.anu.edu.au:3001/api/delete?collection=A&target=B`\
`A` is either `course_data` or `timetable_data`.\
`B` is the course code or timetable creation date (as an integer), whichever you specifically want to delete.