# Developing and using our GitHub documentation

When developing in our Project it is important to publicize what progress we have been making, what decisions have been made, and what reflections we have made.
So this document is intended to help develop everyone's development process.

When you are developing in our codebase, you should be thinking:

- Am I making any important decision choices right now, and if so, should I be documenting it somewhere.
- What I am doing right now, is it in response to something that was discussed in a team meeting, from the client, or from our audits? If so, should I be documenting my reflections on their feedback.
- I am making significant contributions to the codebase right now, should I be communicating what I am doing in the GitHub Projects or an issue on the repository?

### Contributing to the Decisions in the project.

Decisions are formatted in a way that states the basic information needed for record purposes.

|Decision|Outcome|Responsible Party|Decision Date|Status|
|--|--|--|--|--|
|Our client wants for distinctive colouring when viewing the timetable|We are working on filtering that will show what the user would like to see most prominently.|Frontend team|DD/MM/YYYY|In-Progress|

This is just an example of the structure for making decisions, you could include this in the actual decision log located in `laballocator/docs/Decision-log.md` or you can reference the **GitHub Issue #93** in your commits, your comments, your pull requests. This is so we can centralise your decisions if you cannot add them yourself at the time.

### Contributing to the Reflections in the project.

Reflections are whenever we make a change or decision in reflection to feedback that we have received from the team, the client, or during or after an audit. Make sure that we document what the feedback was, what our refleciton to it was, who or what it affects.

|Date|Priority|Category|Feedback|Actions taken/needed|Source|Progress|Action|
|--|--|--|--|--|--|--|--|
|DD/MM/YYYY|High|Repository|Have scattered information everywhere, didn't make the best use of GitHub Projects.|We will follow a guide whenever we work to fill out the relevant management sources.|Team|In-progress|Edward will create the check-list, and the team needs to follow it.|

This is an example of the structure that the reflections hold, where we have some feedback from the team, how we will remedy the issue that we have found, and who is responsible, what progress it is in, and how high priority it is to be resolved.

You can add your own reflections in the `laballocator/docs/reflection-log.md` using the format detailed above or you can reference the **GitHub Issue #92** in your commits, your comments in your issues, your pull requests. This is so we can centralise your decisions if you cannot add them yourself at the time.

### Contributing to the project documentation.

When you are developing it is always good to have an issue that you are working on, something that has a priority level, some form of progress (not started, planning, building, waiting-for-approval), and a start and end time for the issue to be resolved.

What is recommended is that you lay out what you need to have done in regards to reflections or decisions that have been made in meetings, from clients, or from the audits. By understanding what you want to complete, you can curate an issue that details what you want done, who it should be done by, when it is started and when it should be finished by.

This allows your contribution to show in the repository and I would always recommend that you reference whatever issue that you are working on in your commits and pull-requests. This shows progress for your issue and also details what commits are relevant to each issue.

### Checklist for developing in the project.

Here is a checklist that you can use when developing in the project to show what progress is being made:

 - [ ] Analyse what you are working on, does it have an issue,
	 - [ ] **Yes**, when committing make sure to reference your issue/s to show progress in that issue, and if needed updated its progress, discuss deadline changes, create new issues if your issue is too broad.
	 - [ ] **No**, create an issue for your work, make sure that you reference or comment on any decisions that are being made in this issue as well as any reflections that are being made to feedback that has been given.
 - [ ] Make sure that when you are working that you are using a relevant branch that is up-to-date, check if your branch is behind its parent branch and make sure that when you make a pull-request to your parent branch, that you are not conflicting with the parent branch and break anything in it.

These are the basics when working on the project, and how you can show your contribution in the repository. 

---

### Useful resources.

When writing markdown, a useful tool can be [stackedit](stackedit.io) for writing in markdown and formatting well.

---

Written by Edward Nivison

Edited on 07/07/2024
