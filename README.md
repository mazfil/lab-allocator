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

| Period | Milestone | 
|--|--|
| week 1 | Formation of the team |
| week 2 | raw up the first version of statement of work; Assignment of group member roles |
| week 3 | Design the backend codebase |
| week 4 | Database construction; Draft on the second version of statement of work |
| week 5 | Database construction; Design the user interface |
| week 6 | Database construction; Design the logical function of UI |
| week 7 | Database construction; Design and implement the algorithm of backend |
| week 8 | Implement UI |
| week 9 | Establish an API linking UI and database |
| week 10 | Construct the allocation system |
| week 11 | Testing |
| week 12 | Testing |

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

Risk management involves identifying potential risks that could threaten the success of a project, assessing their likelihood and potential impact, and planning strategies to mitigate or avoid them. For the "School of Computing (SoCo) Resource Maximisation Planning System for Labs" project at the Australian National University (ANU), a structured approach to risk management is essential given the project's complexity and the diverse needs of its stakeholders. Here's a detailed risk management plan:

1. Risk Identification
Technical Challenges: Developing a system that can efficiently handle complex scheduling algorithms and a user-friendly interface.
Stakeholder Engagement: Ensuring continuous and effective communication with all stakeholders, including faculty, administrative staff, and potentially students.
Data Accuracy and Completeness: Relying on accurate, comprehensive data regarding course enrollments, lab capacities, and specific requirements.
Integration with Existing Systems: Ensuring the new system can integrate smoothly with existing ANU systems for student information, room booking, etc.
User Adoption: Encouraging users to transition to and adopt the new system, overcoming resistance to change.
Regulatory and Policy Compliance: Adhering to all relevant ANU policies and regulations, including those related to privacy and data security.
Budget and Resource Constraints: Staying within budget and ensuring adequate resources are available throughout the project.
Timeline Delays: Managing potential delays in project milestones due to unforeseen challenges.
Scalability and Performance: Ensuring the system can scale to accommodate future growth and maintain performance.
2. Risk Assessment
Technical Challenges: High likelihood due to the complexity of scheduling algorithms; high impact as it directly affects project success.
Stakeholder Engagement: Medium likelihood as engagement can vary; high impact as stakeholder buy-in is crucial.
Data Accuracy and Completeness: High likelihood due to potential data entry errors or incomplete data; high impact as it affects scheduling accuracy.
Integration with Existing Systems: Medium likelihood as integration can be complex; medium impact depending on the extent of required integration.
User Adoption: High likelihood due to natural resistance to change; high impact as the system's success depends on user adoption.
Regulatory and Policy Compliance: Low likelihood with proper planning; high impact due to potential legal and reputational consequences.
Budget and Resource Constraints: Medium likelihood due to potential unforeseen expenses; medium impact as it could limit project scope.
Timeline Delays: High likelihood as projects of this nature often face delays; high impact as it affects stakeholder satisfaction and project momentum.
Scalability and Performance: Medium likelihood due to technical challenges; high impact as it affects long-term usability.
3. Risk Mitigation Strategies
Technical Challenges: Engage experienced developers, conduct thorough testing, and consider phased rollouts to manage complexities.
Stakeholder Engagement: Regular update meetings, clear communication channels, and involving stakeholders in the development process to ensure their needs are met.
Data Accuracy and Completeness: Implement data validation checks, regular audits, and encourage users to report discrepancies.
Integration with Existing Systems: Early collaboration with IT departments to understand integration points and requirements.
User Adoption: Provide comprehensive training, support, and clear documentation to ease the transition to the new system.
Regulatory and Policy Compliance: Regular reviews of ANU policies and legal requirements, and incorporate compliance checks into the development process.
Budget and Resource Constraints: Maintain a contingency fund for unforeseen expenses and regularly review resource allocations.
Timeline Delays: Implement a flexible project management approach, such as Agile, to accommodate changes and delays more easily.
Scalability and Performance: Design the system with scalability in mind from the outset and conduct stress testing to identify performance bottlenecks early.
4. Monitoring and Review
Establish a regular schedule for monitoring risks, assessing new risks as they emerge, and reviewing the effectiveness of mitigation strategies. This should involve regular meetings with the project team and stakeholders to ensure risks are actively managed throughout the project lifecycle.

## Project costs

The only expected costs for the project would be for the hardware for the server (i.e. a computer). During development/prototyping a student’s computer could be used, and the final system is expected to run on computers provided by the School of Computing / university at no cost. There should be no need for domain name registration as the system is expected to run on the internal university network.

The other resources required is data about labs, rooms and enrollments, which have been provided by the client.

## Project NDA and IP status

The IP of the solution will remain the property of the students in the group, so long as the School of Computing is able to continue to use and modify the software freely.

## Problematisation Analysis

[Problematisation Analysis](https://github.com/mazfil/lab-allocator/tree/main/docs/problematisation-analysis)

## Client's Vision and objectives

- **Efficiency**: To develop a system capable of creating the most efficient lab schedules, maximising the use of available resources.
- **Flexibility**: To accommodate a wide range of constraints and course requirements, ensuring the system's applicability across various teaching periods and evolving academic needs.
- **Usability**: To provide a user-friendly interface that allows staff to input constraints, view schedules, and make adjustments as needed.
- **Scalability**: To ensure the system can handle an increasing number of courses, labs, and constraints without a decrease in performance.

## Stakeholder Analysis

| Stakeholder | Reason | 
|--|--|
| Client | They are commissioning the system so that it can serve their needs in allocating labs to classes. | 
| School of Computing administrative staff | They may be using the system after it is complete to enter data about course enrolments, lab sizes, etc. |
| Course convenors | Need to provide information to the system/School about tutor numbers, and may also have other requirements that affect scheduling | 
| Students | Effective scheduling of classes has a number of benefits to students: Leads to fewer clashes, meaning students can attend more classes ; Ensures the tutor to student ratio is maintained, so students get enough support during classes. |
| Tutors | Effective scheduling of classes ensures that tutor to student ratios are not exceeded, making it easier for tutors to teach. |
| Other users of the buildings in scope | Effective scheduling means less room times are taken up by labs, allowing others to use the rooms for other purposes. |

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
