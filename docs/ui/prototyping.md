# Frontend Prototype
Here we have our frontend prototype developed and designed in Figma.

There are several flows that our prototype addresses, these flows are the most critical to our client and the backbone of our project.

### Uploading data
For the client to upload data, a drop box style overlay is opened allowing a .csv file to be included. The overlay additionally includes a link to ensure that .csv heading formats are correct to ensure smooth and efficient data handling.
![](https://github.com/mazfil/lab-allocator/blob/main/docs/ui/upload.gif)

### Data Management
Sometimes, last minute changes or interfaced data entry may be required. Our datamanagement page, aims to allow our client to address both of these issues. Allowing the user to either edit or enter a single data-point without being required to generate a new .csv for upload.
![](https://github.com/mazfil/lab-allocator/blob/main/docs/ui/edit.gif)

### Timetable Management
After the algorithm processes the uploaded data and finds the best timetable, our client requires the ability to both view and edit data.

This is achieved with different views that address different requirements. Adjustments to course times based on availability can be made by interacting with allocated elements:
![](https://github.com/mazfil/lab-allocator/blob/main/docs/ui/changetime.gif)

Sometimes it will be required to see a calendar where courses can be moved. This will include the ability to filter and edit what data is being presented.

![](https://github.com/mazfil/lab-allocator/blob/main/docs/ui/select-cal-course.gif)

In the case of courses being adjusted, location clashes may occur. It is important that the user is notified of these clashes so that they can be addressed. The purpose of the project will make addressing these occurences easier and more accessible by providing more information that clients currently cannot easily obtain.

![](https://github.com/mazfil/lab-allocator/blob/main/docs/ui/data-clash.gif)
