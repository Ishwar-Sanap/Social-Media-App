# API List for Social Media App Backend

## Authentication

- POST /signup
- POST /login
- POST /logout

## Profile Management

- GET   /profile/view
- PATCH /profile/edit
- GET   /profile/discover/?search=keyword
- POST  /profile/follow/:userId
- POST  /profile/unfollow/:userId
