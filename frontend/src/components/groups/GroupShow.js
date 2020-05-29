import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { isAuthenticated, getUserId, getToken } from '../../lib/auth'
import GroupShowInformation from './GroupShowInformation'
import GroupShowMembers from './GroupShowMembers'
import GroupShowPictures from './GroupShowPictures'
import GroupShowEvents from './GroupShowEvents'
import GroupShowChat from './GroupShowChat'
import { getSingleGroup, joinGroup, leaveGroup, deleteEvent, deletePic, uploadPic, joinEvent, leaveEvent} from '../../lib/api'
import { triggerOutlook } from '../common/Email'


class GroupShow extends React.Component {
  state = {
    group: null,
    currentlyDisplayed: 'information',
    member: false,
    admin: false,
    formData: {
      text: '',
      user:'',
      to: ''
    },
    replyForm: 'default'
  }
  
  
  // fetch
  getData = async () => {
    try {
      const groupId = this.props.match.params.id
      const userId = getUserId()
      const res = await getSingleGroup(groupId)

      this.setState({ 
        group: res.data,
        member: res.data.members.some(member => member.user._id === userId), 
        admin: res.data.createdMember._id === userId,
        replyForm: 'default'
      })
    } catch (err) {
      console.log(err)
    }
  }

  componentDidMount() {
    this.getData()
  }


  // join the group
  handleJoinGroup = async () => {
    try {
      const groupId = this.props.match.params.id
      const userId = getUserId()
      await joinGroup(groupId, userId)
      this.getData()
    } catch (err) {
      console.log(err.response)
    }
  }

  // leave the group
  handleUnsubscribe = async () => {
    try {
      const groupId = this.props.match.params.id
      const userId = getUserId()
      const memberToRemove = this.state.group.members.find(member => member.user._id === userId)
      if (!memberToRemove) return

      await leaveGroup(groupId, memberToRemove._id)
      this.getData()
    } catch (err) {
      console.log(err)
    }
  }


  // control views
  handleViewChange = e => {
    this.setState({ currentlyDisplayed: e.target.name })
  }


  //events
  handleEventDelete = async e => {
    e.preventDefault()
    try {
      const groupId = this.props.match.params.id
      const eventId = e.target.value
      await deleteEvent(groupId, eventId)
      this.getData()
    } catch (err) {
      console.log(err)
    }
  }

  handleJoinEvent = async e => {
    try {
      const groupId = this.props.match.params.id
      const eventId = e.target.value
      await joinEvent(groupId, eventId)
      this.getData()
    } catch (err) {
      console.log(err)
    }
  }

  handleCancelEvent = async (eventId, parId) => {
    try {
      const groupId = this.props.match.params.id
      await leaveEvent(groupId, eventId, parId)
      this.getData()
    } catch (err) {
      console.log(err.response)
    }
  }


  // userAddedImages
  handleUploadPhoto = async e => {
    try {
      const groupId = this.props.match.params.id
      await uploadPic(groupId, { images: e.target.value, user: getUserId() })
      this.getData()
    } catch (err) {
      console.log(err)
    }
  }

  handleDeletePhoto = async e => {
    try {
      const groupId = this.props.match.params.id
      const imageId = e.target.value
      await deletePic(groupId, imageId)
      this.getData()
    } catch (err) {
      console.log(err)
    }
  }
  

  // messages
  handleReplyForm = e => {
    const replyForm = e.target.name
    this.setState({ replyForm })
  }

  handleMessageChange = e => {
    const formData = { ...this.state.formData, [e.target.name]: e.target.value }
    this.setState({ formData })
  }

  handleMessageSubmit = async (groupId, threadId) => {
    try {
      await axios.post(`/api/groups/${groupId}/threads/${threadId}/messages`, {
        text: this.state.formData.text
      }, {
        headers: { Authorization: `Bearer ${getToken()}`}
      })
      this.getData()
    } catch (err) {
      console.log(err)
    }
  }

  handleMessageDelete = async (groupId, threadId, messageId) => {
    try {
      await axios.delete(`/api/groups/${groupId}/threads/${threadId}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${getToken()}`}
      })
      this.getData()
    } catch (err) {
      console.log(err)
    }
  }


  // threads
  handleThreadSubmit = async () => {
    try {
      const groupId = this.props.match.params.id
      await axios.post(`/api/groups/${groupId}/threads`, {
        thread: { text: this.state.formData.text }
      }, {
        headers: { Authorization: `Bearer ${getToken()}`}
      })
      this.getData()
    } catch (err) {
      this.setState({ errors: err })
    }
  }

  handleThreadDelete = async (groupId, threadId) => {
    try {
      await axios.delete(`/api/groups/${groupId}/threads/${threadId}`, {
        headers: { Authorization: `Bearer ${getToken()}`}
      })
      this.getData()
    } catch (err) {
      console.log(err.response)
    }
  }

  handleLikes = async (groupId, threadId, messageId, likes) => {
    try {
      const userId = getUserId()
      if (likes.length > 0 && likes.find( like => like.user._id === userId)) return

      await axios.put(`/api/groups/${groupId}/threads/${threadId}/messages/${messageId}/likes`, {
        user: userId
      }, {
        headers: { Authorization: `Bearer ${getToken()}`}
      })
      this.getData()
      
    } catch (err) {
      console.log(err.response)
    }  
  }

  
  render() {
    const { group, member, admin, currentlyDisplayed, formData, replyForm } = this.state
    if (!group) return null

    return (
      <div className="GroupShow">
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <figure className="image">
                <img src={group.headerImage} alt={group.name} style={{
                  resizeMode: "cover",
                  maxHeight: 400
                }} />
              </figure>
            </div>
          </div>
        </section>

        <div className="TopBtnBar container">
          <div className="columns">
  
            <div className="column">
              <div className="buttons is-left">
                <button 
                  className="button" 
                  name="information" 
                  onClick={this.handleViewChange}
                >
                  <i className="fas fa-mountain"></i>
                  &nbsp;&nbsp;Home
                </button>

                {member &&
                  <button 
                    className="button"
                    name="chat"
                    onClick={this.handleViewChange}
                  >
                    <i className="fas fa-comments"></i>
                    &nbsp;&nbsp;Group Chat
                  </button>
                }

                {member && 
                  <Link to={`/groups/${group._id}/events`}>
                    <button 
                      className="button is-success is-light"
                      style={{ maxWidth: 120 }}
                    >
                      <i className="fas fa-hiking"></i>
                      &nbsp; Create Your Event
                    </button>
                  </Link>
                }
              </div>
              </div>
              <div className="column">
                <div className="buttons is-right">
                  {member && 
                    <button
                      className="button is-danger is-light" 
                      onClick={() => triggerOutlook('', 'Check Hikr.com!')}
                      style={{ fontWeight: 800}}
                    >
                      <i className="fas fa-user-plus"></i>
                      &nbsp;Recommend to Friend
                    </button>
                  }
                  {admin &&
                    <Link 
                      to={`/groups/${group._id}/edit`} 
                      className="button is-light"
                    >
                      Edit Group
                    </Link>
                  }
                  {(isAuthenticated() && !member) && 
                    <button className="button is-danger" onClick={this.handleJoinGroup}>
                      <strong>Join Group</strong>
                    </button>
                  }
                </div>
            </div>


          </div>
        </div>

        <GroupShowInformation
          group={group}
          members={group.members}
          photos={group.userAddedImages}
          events={group.events}
          member={member}
          currentlyDisplayed={currentlyDisplayed}
          handleViewChange={this.handleViewChange}
        />

        <GroupShowMembers
          group={group}
          currentlyDisplayed={currentlyDisplayed} 
        />

        <GroupShowPictures 
          member={member}
          currentlyDisplayed={currentlyDisplayed}
          images={group.userAddedImages} 
          name={group.name}
          handleDeletePhoto={this.handleDeletePhoto}
          handleUploadPhoto={this.handleUploadPhoto}
        />

        <GroupShowEvents
          group={group}
          events={group.events}
          currentlyDisplayed={currentlyDisplayed}
          handleEventDelete={this.handleEventDelete}
          handleJoinEvent={this.handleJoinEvent}
          handleCancelEvent={this.handleCancelEvent}
        />

        <GroupShowChat
          group={group}
          threads={group.threads}
          text={formData.text}
          currentlyDisplayed={currentlyDisplayed}
          replyForm={replyForm}
          handleMessageChange={this.handleMessageChange}
          handleThreadSubmit={this.handleThreadSubmit}
          handleThreadDelete={this.handleThreadDelete}
          handleLikes={this.handleLikes}
          handleReplyForm={this.handleReplyForm}
          handleMessageSubmit={this.handleMessageSubmit}
          handleMessageDelete={this.handleMessageDelete}
        />

        {member && 
          <div className="buttons is-right">
            <button 
              className="button is-small" 
              onClick={this.handleUnsubscribe}
            >
              Leave Group
            </button>
          </div>
        }
      </div>
    )
  }
}

export default GroupShow
