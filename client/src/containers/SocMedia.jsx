import React from 'react'
import PropTypes from 'prop-types'

const SocMedia = props => (
  <div className='profile__pageTwo'>
    <div className='profile__column-L'>
      <div className='form__input-group'>
        <label htmlFor='location' className='form__label'>Twitter
        </label>
        <input
          className='form__input'
          type='url'
          pattern='https?://.+'
          id='twitter'
          name='twitter'
          value={props.profiles.editForm.twitter}
          onChange={e => props.handleInput(e)}
          placeholder='Twitter URL'
        />
      </div>
      <div className='form__input-group'>
        <label htmlFor='location' className='form__label'>Facebook
        </label>
        <input
          className='form__input'
          type='url'
          pattern='https?://.+'
          id='facebook'
          name='facebook'
          value={props.profiles.editForm.facebook}
          onChange={e => props.handleInput(e)}
          placeholder='Facebook URL'
        />
      </div>
      <div className='form__input-group'>
        <label htmlFor='location' className='form__label'>Portfolio link
        </label>
        <input
          className='form__input'
          type='url'
          pattern='https?://.+'
          id='link'
          name='link'
          value={props.profiles.editForm.link}
          onChange={e => props.handleInput(e)}
          placeholder='Portfolio URL'
        />
      </div>
    </div>
    <div className='profile__column-R'>
      <div className='form__input-group'>
        <label htmlFor='location' className='form__label'>LinkedIn
        </label>
        <input
          className='form__input'
          type='url'
          pattern='https?://.+'
          id='linkedin'
          name='linkedin'
          value={props.profiles.editForm.linkedin}
          onChange={e => props.handleInput(e)}
          placeholder='LinkedIn URL'
        />
      </div>
      <div className='form__input-group'>
        <label htmlFor='location' className='form__label'>CodePen
        </label>
        <input
          className='form__input'
          type='url'
          pattern='https?://.+'
          id='codepen'
          name='codepen'
          value={props.profiles.editForm.codepen}
          onChange={e => props.handleInput(e)}
          placeholder='CodePen URL'
        />
      </div>
    </div>
  </div>
)

SocMedia.propTypes = {
  handleInput: PropTypes.func.isRequired,
  profiles: PropTypes.shape({
    editForm: PropTypes.shape({
      facebook: PropTypes.string,
      twitter: PropTypes.string,
      linkedin: PropTypes.string,
      link: PropTypes.string,
      codepen: PropTypes.string
    })
  }).isRequired
}

export default SocMedia
