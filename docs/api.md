# API

## Users

- `GET /api/users?id=` - Get specific user ID with public fields
- `GET /api/users` - Get all users with public fields
- `DELETE /api/users?id=` - Report user, hiding them and challenges until re-activated

## Challenges

- `GET /api/challenges?id=` - Get specific challenge ID
- `GET /api/challenges` - Get list of challenges
- `POST /api/challenges` - Create challenge
- `PUT /api/challenges` - Update challenge
- `DELETE /api/users?id=` - Report challenge, hiding it until re-activated

## Challenge Completions

- `PUT /api/challenges/[id]/completion` - Upsert completion information for specific challenge by current user

## Challenge Likes

- `PUT /api/challenges/[id]/like` - Toggle like information for specific challenge by current user
