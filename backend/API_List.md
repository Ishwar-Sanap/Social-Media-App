# API List for Social Media App Backend

## Authentication

- POST /signup
- POST /login
- POST /logout

## Profile Management

- GET /profile/view
- PATCH /profile/edit
- GET /profile/discover/?search=keyword
- POST /profile/follow/:userId
- POST /profile/unfollow/:userId
- POST /profile/remove/follower/:userId
- GET /profile/details/:userId

## Connections

- POST /request/connect/:userId
- POST /request/accept/:userId
- POST /request/reject/:userId
- GET /request/connections
- POST /request/remove/connection/:userId

## Posts

- POST /post/create
- POST /post/like/:postId
- GET /post/feed
