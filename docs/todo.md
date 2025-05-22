# Todo list

## USERS

### UI-next

- [] create a user profile on signup
- [] update a user profile on signin

### SWR-next

- [] mutations/users

### API-next

- [] [POST] /api/users
- [] [PUT] /api/users

### API-firebase

- [] [POST] /endpoints/api/users
- [] [PUT] /endpoints/api/users

## EXAMS

### UI-next

** list **

- [] Create a page /main/certifications to show a list of certifications
- [] Enable users to register a certification
- [] Create a page /main/certifications/:cert_id
- [] Show a list of latest exams on the above page

** create **

- [] Create an exam on a selected certification
- [] Create pagination of questions
- [] Use Next button to save users answers but not submit the exam
- [] Submit the exam and update all records
- [] Show explainations to each failed question

### SWR-next

- [] mutations/certifications [GET]
- [] mutations/certifications [POST]
- [] mutations/exams [GET]
- [] mutations/exams [POST]

### API-next

- [] [GET] /api/certifications
- [] [POST] /api/certifications
- [] [GET] /api/exams
- [] [POST] /api/exams

### API-firebase

- [] [GET] /endpoints/api/certifications
- [] [POST] /endpoints/api/certifications
- [] [GET] /endpoints/api/exams
- [] [POST] /endpoints/api/exams
  - Check DB
    - Select existing questions
    - MQ to generate questions and register in exam question-list, UI to watch the list and update
