## Chingu Summery Voyage Build.To.Learn: Co/Ment API

**(c) 2017 - The Ursa Majors**
**https://github.com/ursa-majors/co-ment**

Tentative API structure ...

```
API routes 

Public
   POST    >  /api/register    >  stores user acct in db, returns JWT, redirects to home
   POST    >  /api/login       >  returns JWT, redirects to home

Secured
   GET     >  /api/mentees     >  returns all mentees' mentor wanted posts
   GET     >  /api/mentee/:id  >  returns single mentee's mentor wanted post
   GET     >  /api/mentors     >  returns all mentor advert posts
   GET     >  /api/mentor/:id  >  returns single mentor advert post
   POST    >  /api/newpost     >  store new post in db, returns something (confirmation?)
   PUT     >  /api/update/:id  >  update specific post if user is orig author
   DELETE  >  /api/delete/:id  >  update specific post if user is orig author
```

Client Views

```
Home                      > Static landing page with info & login / register links.
Login                     > Form sends http POST request to: /api/login with username & password.
Register                  > Form sends http POST request to: /api/register with username & password.
List/grid of all mentors  > Client sends http GET request to: /api/mentors with valid auth token.
                          > Receives JSON response - array of mentor objects.
                          
Specific mentor           > Client sends http GET request to: /api/mentor/:id with valid auth token.                             > Receives JSON response - single mentor object with spec'd _id
                          > Client logic if user_id = mentor author_id, user can edit & delete
                          
List/grid of all mentees  > Client sends http GET request to: /api/mentees with valid auth token.
                          > Receives JSON response - array of mentee objects.

Specific mentee           > Client sends http GET request to: /api/mentees with valid auth token.
                          > Receives JSON response - single mentee object with spec'd _id.
                          > Client logic if user_id = mentee author_id, user can edit & delete.
```
