import React from 'react'
import { getUserId } from '../../lib/auth'
import Moment from 'react-moment'
import 'moment-timezone'

import Thread from './Thread'

const GroupShowChat = ({
  group, threads, text, currentlyDisplayed, replyForm, handleLikes, handleMessageChange, handleThreadDelete, handleThreadSubmit, handleReplyForm, handleMessageSubmit, handleMessageDelete
}) => {

  return(
    <div 
      className="container Chat"
      style={{ 
        minHeight: 500,
        display: `${currentlyDisplayed === 'chat' ? 'block' : 'none' }`,
        marginTop: 20,
        marginLeft: "auto",
        marginRight: "auto"
      }}
    >
      { threads.map( thread => {
        const groupId = group._id
        const threadId = thread._id
        const numMsg = thread.thread.length
        const numLikes = i => thread.thread[i].likes.length

        return (
          <div key={thread._id}>
            { getUserId() === thread.thread[0].from._id && 
              <div className="buttons is-right" style={{ height: 5}}>
                <button onClick={() => handleThreadDelete(groupId, threadId)}>
                  x
                </button>
              </div>
            }
            <article className="media">
              <figure className="media-left">
                <p className="image is-64x64">
                  <img src={thread.thread[0].from.profileImage} alt={thread.thread[0].from.username} />
                </p>
              </figure>

              <div className="media-content">
                <div className="content">
                  <div>
                    <strong>
                      {thread.thread[0].from.username
                        .replace(thread.thread[0].from.username[0], thread.thread[0].from.username[0].toUpperCase())
                      }
                    </strong>
                    <br />
                    {thread.thread[0].text}
                    <br />
                    {numLikes(0) >= 1 && 
                      <p style={{ fontColor: 'grey', fontSize: 15}}>{numLikes(0)}&nbsp;members liked this comment ❤︎</p> 
                    }
                    {thread.thread[0].from._id !== getUserId() && 
                      <small>
                        <a onClick={() => handleLikes(groupId, threadId, thread.thread[0]._id, thread.thread[0].likes)}>Like</a>
                         · 
                        <a onClick={handleReplyForm} name={threadId}> Reply</a>
                         · 
                        Posted <Moment fromNow ago>{thread.createdAt}</Moment> ago
                      </small>
                    }
                    {thread.thread[0].from._id === getUserId() &&
                      <small>Posted <Moment fromNow ago>{thread.createdAt}</Moment> ago</small>
                    }
                  </div>
                </div>

                {numMsg > 1 && 
                  thread.thread.map( msg => (
                    <Thread
                      key = {msg._id}
                      groupId = {groupId}
                      threadId = {threadId}
                      msg = {msg}
                      numMsg = {numMsg}
                      numLikes = {numLikes}
                      handleMessageDelete = {handleMessageDelete}
                      handleLikes = {handleLikes}
                      handleReplyForm = {handleReplyForm}
                    />
                  ))
                }

                <article className={replyForm === threadId ? 'media' : 'media is-hidden'}>
                  <div className="media-content">
                    <div className="field">
                      <p className="control">
                        <textarea
                          className="textarea" 
                          placeholder="Reply..." 
                          style={{ fontSize: 15 }}
                          onChange={handleMessageChange} 
                          name='text'
                          value={text}
                        />
                      </p>
                    </div>
                    <div className="field">
                      <p className="control">
                        <button 
                          className="button" 
                          onClick={() => handleMessageSubmit(groupId, threadId)}
                        >
                          Reply
                        </button>
                      </p>
                    </div>
                  </div>
                </article>
               
              </div>
            </article>
            <hr />
          </div>
        )})}

      <article 
        className={replyForm === "default" ? 'media' : 'media is-hidden'}
        name="default"
      >
        <div className="media-content">
          <div className="field">
            <p className="control">
              <textarea
                className="textarea" 
                placeholder="Add a comment..." 
                style={{ fontSize: 15 }}
                onChange={handleMessageChange} 
                name='text'
                value={text}
              />
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button className="button" onClick={() => handleThreadSubmit(group._id)}>Post comment</button>
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}

export default GroupShowChat