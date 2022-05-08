# GW2 Sightseeing

## Rough Idea

- Guild Wars 2 exposes some real-time data via [MumbleLink](https://wiki.guildwars2.com/wiki/API:MumbleLink)
- We can expose that data to websites via Web Sockets, and a GW2 Plugin (like [this one](https://github.com/maael/dessa))
- This data includes positional data, and FFXIV has this [Sightseeing Log](https://ffxiv.consolegameswiki.com/wiki/Sightseeing_Log) idea I think is neat, plus GW2 has lots of hidden secret places
- Let's put it all together

## Documents

- [API](./docs/api.md)
- [Objects](./docs/objects.md)

## Features

- [x] Sign in/User system based on [GW2 API Keys](https://wiki.guildwars2.com/wiki/API:API_key)
  - [x] Get Guild data
  - [x] Get Character data
  - [x] Get World data
  - [ ] Allow optionally showing/hiding the data
  - [ ] Have active "Following adventures of..." shown
- [x] Can create Sightseeing "challenges"
  - [x] Including images
  - [ ] Include draft/published states
  - [ ] Include description
  - [ ] Include automatically derived required expansions
  - [ ] Include mount/mastery suggestions
- [x] Can edit
  - All of the above stuff too
- [ ] Users can start challenges
  - [x] Once started, it will automatically track progress while on the challenge page
    - [ ] Maybe capture screen when finding location, achievement style?
  - [x] Should notify (plus noise?) user when a location is found
- [ ] Users can upvote/downvote challenges
- [ ] Users can report challenges
  - [ ] Moves challenges into "reported" state, hiding them, and sending to me for review (for now immediate, maybe threshold in the future)
- [ ] Users can report users
  - [ ] Moves challenges into "reported" state, hiding them and any of their challenges, and sending to me for review (for now immediate, maybe threshold in the future)
