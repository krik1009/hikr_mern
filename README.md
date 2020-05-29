### Hikr - the hikers' community to curate the hike infomation and related events

## Technologies
- MERN - Full-stack web app

# Backend
- Node.js/Express
- Mongoose
    - Models/Controllers
      - User (embedded relationships w Hike - completed hikes, fav hikes, w Group - members)
      - Group (embedded relationship w)
      - Hike
- Mongo.db
  - Users
  - Groups
  - Hikes

# Frontend
- React/Javascript
- Bulma/SCSS


## UI/UX
Common
- smooth interaction among hike page, group page, and profile page
- register/login function to protect profile information, add-on functions to register new hikes, or create groups

Hike
- 3 different views to search the best hike
- Detailed information

Profile
- One-stop profile page for all the registered users (can edit the profile on the same page)

Group
- One-stop-shop for hikers' groups
- Create and orginize events
- Chat board available for the group members



####### Reference

(Model details)
User
- username
- email
- password
- profile image
- biography
- completed hikes - embedded
- favourited hikes - embedded
(group members, user added images, user created hike)

Group
- group name
- group members - referenced (to user)
- events/meetups - form (add new event - date, time, selection of hikes) - referenced
- imageHeader - 
- user added images - embedded
- group messages - embedded

Hike
- name
- location (lat/long)
- country
- description
- distance
- difficulty rating - 
- time to complete
- images 
- user added images - referenced (to user)
- comments - embedded
- stars out of 5 - embedded
- approprite seasons
- user created hike - referenced (to user)



(Controller details)
User 
- Create user
- Read SingleUser
- Update
- Delete

Groups
- Create Group
- Read
- Update
- Delete
- comment/messages
- add new event

Hikes
- Create 
- Find by Id
- Update
- Delete
- Comment
- Add Favourite
- Add image


(Routes details)
/hikes - index page GET/POST
/hikes/:id - hike show page GET/PUT/DELETE
/hikes/:id/comments - hike comments page POST
/hikes/:id/comments/:id - delete comment DELETE/PUT

/register - POST
/login - POST

/groups groups index page GET/POST
/groups/:id group profile page GET/PUT/DELETE
/groups/:id/messages - groups messages page POST
/groups/:id/messages/:id - delete/edit messages DELETE/PUT
/groups/:id/events index and create events GET/POST    
/groups/:id/events/:id GET/PUT/DELETE

/profiles  idex of users GET
/profiles/:username users profile pages GET/POST/PUT/DELETE
