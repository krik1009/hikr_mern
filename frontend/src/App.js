import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import SecureRoute from './components/common/SecureRoute'

//common
import Home from './components/common/Home'
import Navbar from './components/common/Navbar'


// auth
import Login from './components/auth/LoginorRegister'

import ProfileIndex from './components/profiles/ProfilesIndex'
import ProfileShow from './components/profiles/ProfileShow'
import ProfileEdit from './components/profiles/ProfileEdit'

//hikes
import HikesIndex from './components/hikes/HikesIndex'
import HikeShow from './components/hikes/HikeShow'
import HikeCreate from './components/hikes/HikeCreate'
import HikeUpdate from './components/hikes/HikeUpdate'

// groups
import GroupIndex from './components/groups/GroupIndex'
import GroupShow from './components/groups/GroupShow'
import GroupNew from './components/groups/GroupNew'
import GroupEdit from './components/groups/GroupEdit'
import EventShow from './components/groups/EventShow' 
import GroupEventEdit from './components/groups/GroupEventEdit'
import GroupEventNew from './components/groups/GroupEventNew'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <SecureRoute path="/profiles/:id/edit" component={ProfileEdit} />
        <SecureRoute exact path="/profiles/:id" component={ProfileShow} />
        <SecureRoute path="/profiles" component={ProfileIndex} />

        <Route path="/hikes/new" component={HikeCreate} />
        <Route path="/hikes/:id/update" component={HikeUpdate} />
        <Route path="/hikes/:id" component={HikeShow} />
        <Route path="/hikes" component={HikesIndex} />

        <SecureRoute exact path="/groups/:id/events/:eventId/edit" component={GroupEventEdit} />
        <SecureRoute exact path="/groups/:id/events/:eventId" component={EventShow} />
        <SecureRoute path="/groups/:id/events" component={GroupEventNew} />
        <SecureRoute path="/groups/:id/edit" component={GroupEdit} />
        <SecureRoute path="/groups/register" component={GroupNew} />
        <Route path="/groups/:id" component={GroupShow} />
        <Route path="/groups" component={GroupIndex} />
      </Switch>
    </BrowserRouter>
  )
}

export default App