import React from 'react'
import { Link } from 'react-router-dom'
import { triggerOutlook } from '../common/Email'

const GroupShowInformation = ({ member, currentlyDisplayed, group, members, photos, events, handleViewChange }) => {

  return (
    <div className="GroupShow container">
      <div className="Information" 
          style={{ 
            display: `${currentlyDisplayed === 'information' ? 'block' : 'none' }` 
          }}
      >
        <section className="section">
          <div className="container" style={{ minHeight: 500}}>
            <h1 className="title"><strong>Welcome to {group.name}! </strong></h1>
            <br />

            <p className="subtitle">Description</p>
            <div className="content">{group.description}</div>
            <br />

            <div className="columns is-full">
              <div className="column is-5">
                <p className="subtitle">Group Admin</p>
                <article className="media">
                  <div className="media-left">
                    <figure className="image is-64x64">
                      <img src= {group.createdMember.profileImage} className="is-rounded" alt={group.createdMember._id} />
                      </figure>
                  </div>
                  <div className="media-content">
                    <div className="content">
                      <div>
                        <p>
                          <strong>{group.createdMember.username.replace(group.createdMember.username[0], group.createdMember.username[0].toUpperCase())}&nbsp;</strong><small style={{fontSize: 15}}>{group.createdMember.email}</small>
                        </p>
                        <p style={{ fontSize: 12, fontFamily: "arial" }}>{group.createdMember.bio}</p>
                      </div>

                      <div className="level-left" style={{ display: 'flex' }}>
                        <Link 
                          to={`/profiles/${group.createdMember._id}`} 
                          className="level-item bio"
                          style={{ fontSize: 10, color: 'blue', fontFamily: "arial"}}
                        >
                          See profile
                        </Link>
                        <a
                          className="level-item" 
                          aria-label="2.reply"
                          onClick={() => triggerOutlook(group.createdMember.email, 'Hi from Hikr.com!')}
                        >
                          <span className="icon is-small">
                            <i className="fas fa-reply" aria-hidden="true"></i>
                          </span>
                        </a>
                      </div>

                    </div>
                  </div>
                </article>
              </div>


              <div className="column is-7">
                <p className="subtitle">Members</p>
                <div className="columns is-multiline">
                  {members.map( member => (
                    <Link to={`/profiles/${member._id}`} key={member._id}>
                      <div className="column" style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <figure className="image is-64x64" key={member._id}>
                          <img src={member.user.profileImage} className="is-rounded" alt="img"/>
                        </figure>
                        <p style={{ fontSize: 20}}>{member.user.username}</p>
                      </div>
                    </Link>
                  ))} 
                </div>
              </div>
            </div>
            <div className="buttons is-right">
              <button 
                className="button is-light"
                name="members" 
                onClick={handleViewChange}
                style={{ width: 150 }}
              >
                <i className="fas fa-users" aria-hidden="true"></i>
                &nbsp;&nbsp;More Members
              </button>
            </div>


            <br /><hr /><br />

            <p className="subtitle">Our Photo Gallery</p>
            <div
              className="container" 
              style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap"}}>
              {photos.length >= 1 ?  
                photos.map( photo => (
                  <figure className="image" key={photo._id}>
                    <img 
                      src={photo.images}
                      style={{ width: 150, height: 150, margin: 10, boxShadow: "3px 3px 3px #9E9E9E" }} 
                      alt="img"
                    />
                  </figure>
                ))
                :
                <p style={{ fontSize: 15 }}>Coming soon...</p>
              }
            </div>
            <div className="buttons is-right">
              {member && 
                <button 
                  className="button is-light"
                  name="pictures"
                  onClick={handleViewChange}
                  style={{ width: 150 }}
                >
                  <i className="fas fa-image" aria-hidden="true"></i>
                  &nbsp;&nbsp;More photos
                </button>
              }
            </div>

            <br /><hr /><br />

            <p className="subtitle">Upcoming Event</p>
            <div className="columns is-multiline">
              {events.length >= 1 ?  
                events.map( event => (
                  <Link to={{
                    pathname: `/groups/${group._id}/events/${event._id}`,
                    state: {
                      group: group,
                      event: event,
                      currentlyDisplayed: currentlyDisplayed
                    }
                  }}
                  >
                    <div 
                      className="column box" 
                      style={{ 
                        width: 200,
                        height: 250,
                        display: "flex", 
                        alignItems: "center", 
                        flexDirection: "column",
                        margin: 10
                      }}
                      key={event._id}
                    >
                      <p><strong>{event.eventName}</strong></p>
                      <p style={{fontSize: 20}}><i className="fas fa-mountain"></i>&nbsp;{event.hike.name}</p>
                      <figure className="image is-128x128">
                        <img src={event.hike.images[0]} alt="img" />
                      </figure>
                      <p style={{fontSize: 18}}>On&nbsp;{event.startDate.slice(0, 10)}</p>
                    </div>
                  </Link>
                ))
                :
                <p style={{ fontSize: 15 }}>&nbsp;&nbsp;&nbsp;&nbsp;Coming soon...</p>
              } 
            </div>
            <div className="buttons is-right">
              {member && 
                <button 
                  className="button is-light" 
                  name="events" 
                  onClick={handleViewChange}
                  style={{ width: 150 }}
                >
                  <i className="far fa-calendar-check" aria-hidden="true"></i>
                  &nbsp;See more e  vents
                </button>
              }
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GroupShowInformation 