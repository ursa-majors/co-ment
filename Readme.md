# Chingu Summer Voyage Build.To.Learn: Co/Ment API

**(c) 2017 - The Ursa Majors**

**https://github.com/ursa-majors/co-ment**

## Nav

* [Notes and Resources](#notes-and-resources)
* [API structure](#tentative-api-structure)
* [Client Views](#client-views)

## Notes And Resources

[Express Router](http://expressjs.com/en/api.html#router)


## Tentative API structure

| VERB   | ENDPOINT        | SECURE | DESCRIPTION      |
|:-------|:----------------|:------:|:-----------------|
| POST   | /api/register   |        | stores user acct in db, returns JWT, redirects to home |
| POST   | /api/login      |        | returns JWT, redirects to home |
| GET    | /api/mentees    |   Y    | returns all mentees' mentor wanted posts  |
| GET    | /api/mentee/:id |   Y    | returns single mentee's mentor wanted post  |
| GET    | /api/mentors    |   Y    | returns all mentor advert posts  |
| GET    | /api/mentor/:id |   Y    | returns single mentor advert post  |
| POST   | /api/newpost    |   Y    | store new post in db, returns something (confirmation?)  |
| PUT    | /api/update/:id |   Y    | update specific post if user is orig author  |
| DELETE | /api/delete/:id |   Y    | update specific post if user is orig author  |


## Client Views

| VIEW                | DESCRIPTION      |
|:--------------------|:-----------------|
| Home                | Static landing page with info & login / register links |
| Login               | Form sends http POST request to: /api/login with username & password |
| Register            | Form sends http POST request to: /api/register with username & password |
| List of all mentors | Client sends http GET request to: /api/mentors with valid auth token. Receives JSON response - array of mentor objects. |
| Specific mentor     | Client sends http GET request to: /api/mentor/:id with valid auth token. Receives JSON response - single mentor object with spec'd _id. Client logic if user_id = mentor author_id, user can edit & delete |
| List of all mentees | Client sends http GET request to: /api/mentees with valid auth token. Receives JSON response - array of mentee objects. |
| Specific mentee     | Client sends http GET request to: /api/mentees with valid auth token. Receives JSON response - single mentee object with spec'd _id. Client logic if user_id = mentee author_id, user can edit & delete. |
