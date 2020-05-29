import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import 'moment-timezone'

import { triggerOutlook } from '../common/Email'

const GroupShowMembers = ({group, currentlyDisplayed}) => {
  return (
      <div className="container"
      style={{ 
        minHeight: 500,
        display: `${currentlyDisplayed === 'members' ? 'block' : 'none' }` ,
        marginTop: 20,
        marginLeft: "auto",
        marginRight: "auto"
      }}>
      {group.members.map(member => {
        const hike = member.user.favoriteHikes
        return (
          <article className="media" key={member.user._id}>
            <div className="media-left">
              <figure className="image is-64x64">
                <img src={member.user.profileImage} alt={member.user.username} />
              </figure>
            </div>
            <div className="media-content">
              <div className="content">
                <div>
                <strong>{member.user.username.replace(member.user.username.charAt(0), member.user.username.charAt(0).toUpperCase())}</strong>
                {/* <small>{member.user.email}</small> */}
                  <br />

                  <p style={{ fontStyle: 'italic', fontSize: 15}}>{member.user.bio}</p>
                

                  <br />
                  {hike && <p>Favorite Hikes:&nbsp;{member.user.favoriteHikes[0]}</p>}

                  <br />
                  <p style={{ fontSize: 10}}>
                    Member since&nbsp;<Moment format="MM/YYYY">{member.createdAt}</Moment>
                  </p>
                </div>
              </div>



              <nav className="level is-mobile">
                <div className="level-left">
                  <Link 
                    to={`/profiles/${member.user._id}`} 
                    className="level-item" 
                    aria-label="1.profile"
                    style={{ fontSize: 10, color: 'blue', fontFamily: "arial"}}
                  >
                    See profile
                  </Link>

                  <a 
                    className="level-item" 
                    aria-label="2.reply"
                    onClick={() => triggerOutlook(member.user.email, 'Hi from Hikr.com!')}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-reply" aria-hidden="true"></i>
                    </span>
                  </a>

                  <a className="level-item" aria-label="3.favHike" href="null">
                    <span className="icon is-small">
                      { member.user.favoriteHikes ? 
                        <Link to={`/hikes/${member.user.favoriteHikes[0]._id}`}>
                          <i className="fas fa-heart" aria-hidden="true"></i>
                        </Link>
                        : 
                        ''
                      }
                    </span>
                  </a>
                </div>
              </nav>
            </div>
          </article>
        )})}
      </div>
  )
}

export default GroupShowMembers