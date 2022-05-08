# Objects

## Users

```json
{
  "id": "{ObjectId}",
  "accountData": {
    "access": ["PathOfFire"],
    "characters": [
      {
        "age": 0,
        "class": "Virtuoso",
        "gender": "Male",
        "guild": "1",
        "name": "Syaoranli",
        "profession": "Mesmer",
        "race": "Asuran"
      }
    ],
    "guilds": [{ "id": "1", "name": "name", "tag": "[RPS]" }],
    "name": "Name.1231",
    "world": { "id": "1001", "name": "name", "region": "EU" }
  },
  "role": "user|editor|admin",
  "apiKey": "123-123",
  "createdAt": "2021-01-01T10:00:00",
  "gw2Name": "Name.1231",
  "gw2Id": "123-123",
  "primaryCharacter": 0,
  "settings": {
    "mode": "dark"
  },
  "status": "active",
  "updatedAt": "2021-01-01T10:00:00",
  "challenges": "{Challenge}[]",
  "challenges": "{ChallengesCompletion}[]"
}
```

### Indexes

- `gw2Name` - to allow upserts

## Challenges

```json
{
  "id": "{ObjectId}",
  "authorId": "{ObjectId}",
  "author": "{User}",
  "createdAt": "2021-01-01T10:00:00",
  "updatedAt": "2021-01-01T10:00:00",
  "name": "name",
  "description": "description",
  "state": "draft|active|reported",
  "mounts": ["Skyscale"],
  "masteries": ["Mushroom"],
  "image": "/image/path",
  "likes": 0,
  "steps": [
    {
      "id": "ObjectId",
      "name": "name",
      "description": "description",
      "image": "/image/path",
      "precision": 100,
      "location": {
        "x": 1,
        "y": 2,
        "z": 3
      }
    }
  ]
}
```

## Challenge Completions

```json
{
  "id": "{ObjectId}",
  "challengeId": "{ObjectId}",
  "userId": "{ObjectId}",
  "user": "{User}",
  "steps": [
    {
      "id": "123-123",
      "completedAt": "2021-01-01T10:00:00"
    }
  ]
}
```

### Indexes

- `challengeId` and `userId` - to allow upserts

## Challenge Likes

```json
{
  "id": "{ObjectId}",
  "challengeId": "{ObjectId}",
  "userId": "{ObjectId}"
}
```

### Indexes

- `challengeId` and `userId` - to allow upserts
