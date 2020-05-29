import React from 'react'
import { getUserId } from '../../lib/auth'
import Moment from 'react-moment'
import 'moment-timezone'

const Thread = ({ msg, groupId, threadId, numMsg, numLikes, handleMessageDelete, handleLikes, handleReplyForm }) => (
  <article className="media">
    {getUserId() === msg.from._id && 
      <div className="buttons is-right" style={{ height: 5}}>
        <button onClick={() => handleMessageDelete(groupId, threadId, msg._id)}>
          x
        </button>
      </div>
    }
    <figure className="media-left">
      <p className="image is-48x48">
        <img src={msg.from.profileImage} alt={msg.from.username} />
      </p>
    </figure>
    <div className="media-content">
      <div className="content">
        <div>
          <strong>
          {msg.from.username
            .replace(msg.from.username[0], msg.from.username[0].toUpperCase())
          }
          </strong>
          <br />
          {msg.text}
          <br />
          {numLikes(1) >= 1 && 
            <p style={{ fontColor: 'grey', fontSize: 15}}>{numLikes(1)}&nbsp;members liked this comment ❤︎</p> 
          }
          {msg.from._id !== getUserId() && 
            <small>
              <a onClick={() => handleLikes(groupId, threadId, msg._id, msg.likes)}>Like</a>
              · 
              <a onClick={handleReplyForm} name={threadId}> Reply</a>
              · 
              Posted <Moment fromNow ago>{msg.createdAt}</Moment> ago
            </small>
          }
          {msg.from._id === getUserId() &&
            <small>Posted <Moment fromNow ago>{msg.createdAt}</Moment> ago</small>
          }
        </div>
      </div>
    </div>
  </article>
)

export default Thread