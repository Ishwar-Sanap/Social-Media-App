# API List for Social Media App Backend

## Authentication

- POST /signup --> done
- POST /login  --> done
- POST /logout --> done

## Profile Management

- GET /profile/view    --> done 
- PATCH /profile/edit --> done
- GET /profile/discover/?search=keyword --> done
- POST /profile/follow/:userId --> done
- POST /profile/unfollow/:userId --> done
- POST /profile/remove/follower/:userId --> done
- GET /profile/details/:userId --> done

## Connections

- POST /request/connect/:userId --> done
- POST /request/accept/:userId --> done
- POST /request/reject/:userId --> done
- GET /request/connections --> done
- POST /request/remove/connection/:userId --> done

## Posts

- POST /post/create --> done
- POST /post/delete/:postId --> done
- POST /post/like/:postId --> done
- GET /post/feed --> done

## Stories
- POST /story/create --> done
- POST /story/delete/:storyId
- GET /story/get --> done
- POST /story/seen/:storyId

## Messaging
- POST /message/send --> done
- GET /message/chats/:userId --> done
- GET /message/recents --> done