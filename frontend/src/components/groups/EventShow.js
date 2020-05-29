import React from 'react'
import { Link } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

import { getUserId } from '../../lib/auth'
import { getSingleGroup, getSingleEvent, deleteEvent, joinEvent, leaveEvent } from '../../lib/api'
import { triggerOutlook } from '../common/Email'


class EventShow extends React.Component {
  state = {
    group: null,
    event: null,
    currentlyDisplayed: 'events'
  }

  getData = async () => {
    try {
      const groupId = this.props.match.params.id
      const group = await getSingleGroup(groupId)
  
      const eventId = this.props.match.params.eventId 
      const event = await getSingleEvent(groupId, eventId)
  
      this.setState({ group: group.data, event: event.data })
    } catch (err) {
      console.log(err)
    }
  }

  async componentDidMount() {
    this.getData()
  }

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


  render() {
    const { group, event, currentlyDisplayed } = this.state

    if (!group) return null
    if (!event) return null

    const userId = getUserId()
    const isInGroup = (participants) => {
      return participants.some(person => person.user._id === userId)
    }
    const numOfPs = event.participants.length
    const participantId = event.participants.find(par => par.user._id === userId)
  
    return (
      <div 
        className="Event container"    
        style={{ 
          minHeight: 500,
          display: `${currentlyDisplayed === 'events' ? 'block' : 'none' }`,
          marginTop: 20,
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        <div className="box" key={event._id}>
          {event.createdMember._id === getUserId() && 
            <div className="buttons is-right">
              <Link to={`/groups/${group._id}/events/${event._id}/edit`} className="button is-small">
                Edit event
              </Link>
              <button className="button is-small" value={event._id} onClick={this.handleEventDelete}>
                Delete
              </button>
            </div>
          }
  
          <h1 className="subtitle" style={{ fontSize: 30, fontFamily: "Amatic SC, cursive"}}><strong>{event.eventName}</strong></h1>
          <p style={{fontSize: 18}}>~&nbsp;{event.description}~</p>
          <br />
  
          <div className="columns">
            {event.hike &&
              <div className="column">
                <p style={{ fontFamily: 'Amatic SC, cursive', fontSize: 20}}>
                  <i className="fas fa-mountain"></i>&nbsp;
                  Course:&nbsp;{event.hike.name}&nbsp;
                </p>
                {event.hike.images.length >= 1 && 
                  <figure className="image is-3by2">
                    <img src={event.hike.images[0]} alt="img" />
                  </figure>
                }
                <p style={{fontSize: 15, marginTop: 2}}>
                  &nbsp;&nbsp;&nbsp;
                  <i className="fas fa-hiking"></i>
                  &nbsp;{event.hike.difficulty}
                </p>
                <p style={{fontSize: 15}}>
                  &nbsp;&nbsp;&nbsp;
                  <i className="fas fa-globe"></i>
                  &nbsp;{event.hike.country}
                </p>
                <p className="HikeDescription" style={{ fontSize: 15, maxHeight: 300, overflow: "auto" }}>
                  &nbsp;&nbsp;&nbsp;
                  <i className="fas fa-info-circle"></i>
                  &nbsp;{event.hike.description}
                </p>
  
                <p>
                  <Link to={`/hikes/${event.hike._id}`} style={{ fontSize: 10, color: 'blue', fontFamily: "arial"}}>
                    &nbsp;&nbsp;&nbsp;<i className="fas fa-flag"></i>&nbsp;Check more info
                  </Link>
                </p>
              </div>
            }
  
            <div className="column">
              <p style={{ fontSize: 20, fontFamily: "Amatic SC, cursive"}}>
                <i className="fas fa-user"></i>&nbsp;
                Event Host:&nbsp;
                {event.createdMember.username.replace(event.createdMember.username[0], event.createdMember.username[0].toUpperCase())}
              </p>
              <Link to={`/profiles/${event.createdMember._id}`}>
                <figure className="image is-rounded is-64x64">
                  <img className="is-rounded" src={event.createdMember.profileImage} alt={event.createdMember.username} />
                </figure>
              </Link>
              
              <div className="level-left" style={{ display: "flex"}}>
                <Link 
                  to={`/profiles/${event.createdMember._id}`} 
                  className="level-event bio"
                  style={{ fontSize: 10, color: 'blue', fontFamily: "arial", marginRight: 10}}
                >
                  See profile
                </Link>
                <a 
                  className="level-event" 
                  aria-label="2.reply"
                  onClick={() => triggerOutlook(event.createdMember.email, `Hi from Hikr.com: Interested in ${event.eventName}`)}
                >
                  <span className="icon is-small">
                    <i className="fas fa-reply" aria-hidden="true"></i>
                  </span>
                </a>
              </div>
  

              <br />
              {numOfPs > 1 ?
                <p style={{fontSize: 15, marginBottom: 10}}>{`${numOfPs} members will participate`}</p> 
                :
                <p style={{fontSize: 15}}>Be the first participant!</p>
              }
              {numOfPs > 1 && 
                <div className="columns" style={{ display: "flex" }}>
                  {event.participants.map(par => {
                    return (
                      <div className="column" key={par._id}>
                        <figure className="image">
                          <img 
                            className="is-rounded"
                            src={par.user.profileImage}
                            style={{ maxHeight: 64, maxWidth: 64, margin: 10}}
                            alt="event"
                          />
                        </figure>
                      </div>
                    )})
                  }
                </div>
              }
              <br /><hr />
              <p style={{ fontSize: 20, fontFamily: "Amatic SC, cursive"}}>
                <i className="far fa-calendar-alt"></i>&nbsp;
                Schedule
              </p>
              <p>{`From ${event.startDate.slice(0, 10)} to ${event.endDate.slice(0, 10)}`}</p>
              <div style={{ margin: 20}}>
                <Calendar
                  value={[new Date(event.startDate), new Date(event.endDate)]}
                />
              </div>
            </div>
          </div>
        
          
          <div className="buttons is-right">
            {!isInGroup(event.participants) &&
              <button 
                className="button is-danger is-light"
                value={event._id} 
                onClick={this.handleJoinEvent}
              >
                Join
              </button>
            }
            {isInGroup(event.participants) &&
              <button 
                className="button is-small" 
                onClick={() => this.handleCancelEvent(event._id, participantId._id)}
                style={{ fontSize: 15}}
              >
                Leave Event
              </button>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default EventShow