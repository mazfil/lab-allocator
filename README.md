# SoCo - *Resource Maximisation Planning System for Labs*

Our aim for this project is to create a resource allocation application for SoCo computer labs. The app will make use of resources available and be adaptable to new entries to create a working timetable for the Computing courses and the limited resources (Computer Lab rooms) whilst following a strict set of pre-defined constraints and restrictions.

The end vision of the project will be to have a application that will adapt to new entries and create the best layout of courses in a given week based on the strict restrictions and constraints.

As SoCo is a new project beginning in Semester 1, 2024. There is currently no content in the GitHub but will be structured and laid out as the project evolves.

## Table of Contents

- [Team Members and Roles](https://github.com/mazfil/lab-allocator/blob/main/README.md#team-members-and-roles)
- [Statement of Work](https://github.com/mazfil/lab-allocator/blob/main/README.md#statement-of-work)
- [Project Deliverables](https://github.com/mazfil/lab-allocator/blob/main/README.md#project-deliverables)
- [Technical Constraints](https://github.com/mazfil/lab-allocator/blob/main/README.md#technical-constraints)
- [Project Resources](https://github.com/mazfil/lab-allocator/blob/main/README.md#project-resources)
- [Risk Management](https://github.com/mazfil/lab-allocator/blob/main/README.md#risk-management)
- [Project Costs](https://github.com/mazfil/lab-allocator/blob/main/README.md#project-costs)
- [Project NDA and IP status](https://github.com/mazfil/lab-allocator/blob/main/README.md#project-nda-and-ip-status)
- [Problematisation Analysis](https://github.com/mazfil/lab-allocator/blob/main/README.md#problematisation-analysis)
- [Client's Vision and objectives](https://github.com/mazfil/lab-allocator/blob/main/README.md#clients-vision-and-objectives)
- [Stakeholder Analysis](https://github.com/mazfil/lab-allocator/blob/main/README.md#clients-vision-and-objectives)
- [Technical Reports](https://github.com/mazfil/lab-allocator/blob/main/README.md#technical-reports)
- [Meeting Minutes](https://github.com/mazfil/lab-allocator/blob/main/README.md#meeting-minutes)
- [Acknowledgements](https://github.com/mazfil/lab-allocator/blob/main/README.md#acknowledgements)

## Team Members and Roles

| UID | Name | Course | Role |
|--|--|--| -- |
| u7498708 | Edward Nivison | COMP3500 | Project Manager |
| u7468248 | Alex Boxall | COMP3500 | Backend Designer |
| u7605165 | Hexuan Meng | COMP8715 | Backend and Testing |
| u6934917 | Filip Mazur | COMP3500 | Spokesperson |
| u7313113 | Matthew Cawley | COMP3500 | Developer |
| u7556970 | Rachel Cao | COMP3500 | Backend and Admin |
| u7230574 | Sineeha Kodwani | COMP3500 | Deputy Spokesperson |


## Statement of Work

[Statement of Work](https://drive.google.com/file/d/1USw2ds48Q9YWry7tf1vOvsdxDs4dL790/view?usp=sharing) \
\
*^^^Add a link to the statement of work in GitHub^^^*

## Project Deliverables

### week 1 
- Formation of the team
### week 2
- Draw up the first version of statement of work
- Assignment of group member roles
### week 3
- Design the backend codebase
### week 4
- Database construction 
- Draft on the second version of statement of work
### week 5 
- Database construction 
- Design the user interface 
### week 6
- Database construction 
- Design the logical function of UI
### week 7
- Database construction 
- Design and implement the algorithm of backend
### week 8
- Implement UI
### week 9
- Establish an API linking UI and database
### week 10
- Construct the allocation system
### week 11 - week 12
- Testing

## Technical constraints

### Reliability

- **Fault Tolerance**: In case of the server going down, client devices shutting down, and other cases. The program should have a save point every so often it can revert back to. This could be as simple as saving the point of time it is at somewhere and replacing it every so often.
- **Error Handing**: There should be specific case errors written when developing this application so the user/developer can understand what is being done incorrectly and doesn't leave them clueless as to why the program is not working.
- **Data Integrity**: There should not be changes to the data directly unless it is explicitly asked by the end-user (and even so with confirmation). The data should be changed via copying it, not changing it directly at the source.
- **Monitoring and Logging**: There should be a method of monitoring and logging functionalities to track system performance, identify issues proactively and faciliatate troubleshooting.

### Security

- **Access Control**: There should be a hierarchy of who can access certain parts of the program, and this should include any sensitive data and functionalities within the application.
- **Data Encryption**: Utilize encryption techniques to protect sensitive data from un-authorized tampering.
- **Authentication and Authorization**: Implement secure authentication mechanisms to verify the identities of users and grant appropriate permissions based on their roles.
- **Secure Communication**: Ensure that data exchanged between the application and external systems is transmitted securely over encrypted channels, such as HTTPS or other secure formats.

### Safety

- **Code Review and Testing**: Conduct thorough code reviews and testing to identify and address security vulnerabilities, bugs, and logic errors that could potentially compromise the safety and reliability of the application. This may involve manual code reviews, automated static code analysis, and dynamic application security testing (DAST).
- **Data Privacy and Protection**: Implement measures to safeguard sensitive data collected and processed during the development process, such as personally identifiable information (PII) and confidential project docuemtns. This may include data anonymization, encryption, and access controls to protect against data breaches and un-authorized access.
- **Version Control and Change Management**: Utilize versioning control and change management, for example using pull requests when changes are made with a code review in place to ensure whatever the new addition is, is not going to compromise safety.
- **Dependency Management**: Regularly review and update dependencies (e.g., libraries, frameworks, third-party components) used in the application to address security vulnerabilies and ensure compatibility with security patches and updates released by vendors.
- **Documentation and Training**: Provide comprehensive documentation and training materials to developers and other stakeholders on secure development practices, security guidelines, and incident response procedures to promote awareness and adherence to safety and security best practices throughout the development lifecycle.

## Project Resources

## Risk Management

## Project costs

## Project NDA and IP status

## Problematisation Analysis

### Project Client Map

## Client's Vision and objectives

## Stakeholder Analysis

## Technical Reports

[Technical Reports](https://github.com/mazfil/lab-allocator/tree/main/docs/technical-reports)

## Meeting Minutes

- [Client Meetings](https://github.com/mazfil/lab-allocator/tree/main/docs/meetings/client-meetings)
- [Team Meetings](https://github.com/mazfil/lab-allocator/tree/main/docs/meetings/team-meetings)
- [Tutorial Meetings](https://github.com/mazfil/lab-allocator/tree/main/docs/meetings/tutorial-meetings)

## Acknowledgements

Appreciation for the Lecturers, Convenors, Examiners, Tutors, and Speakers for the Australian National University course COMP3500 - Software Engineering Project, and its respective parallel courses being run. Thanks for everything you are doing to help us through our journey in Computer Science.\
\
*Insert some special acknowledgements here (e.g., tutors, shadow teams, etc. ).*
