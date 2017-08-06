import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactTable from 'react-table';

import * as Actions from '../store/actions/postActions';
import { formatDate } from '../utils/';

class Posts extends React.Component {

  componentDidMount() {
    axios.get('https://co-ment.glitch.me/api/posts', {
      headers: {
        Authorization: `Bearer ${this.props.appState.authToken}`,
      },
    })
    .then((response) => {
      this.props.actions.setPosts(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {

    // const makePlaceholderFilter = (placeholder) => {
    //   return ({filter, onFilterChange}) => (
    //       <input type='text'
    //         placeholder={placeholder}
    //         style={{
    //           width: '100%'
    //         }}
    //         value={filter ? filter.value : ''}
    //         onChange={(event) => onFilterChange(event.target.value)}
    //       />
    //     )
    // }

    const tableColumns = [
      { Header: () => <div className="posts__tableHead">Role</div>,
        accessor: 'role',
        minWidth: 40,
        filterable: true,
        Cell: props =>
          <div className="posts__cell">
          {props.original.role}
          </div>,
    //     Filter: ({filter, onFilterChange}) => (
    //   <select
    //     onChange={event => onFilterChange(event.target.value)}
    //     style={{width: '100%'}}
    //     value={filter ? filter.value : 'all'}>
    //     <option value="all"></option>
    //     <option value="mentor">Mentor</option>
    //     <option value="mentee">Mentee</option>
    //   </select>
    // ),
        // Filter: makePlaceholderFilter('Search...')
      },
      { Header: () => <div className="posts__tableHead">Title</div>,
        accessor: 'title',
        minWidth: 120,
        Cell: props =>
          <div className="posts__cell">
        {/* ///// THIS WILL LINK TO THE INDIVIDUAL POST VIEW ONCE THAT COMPONENT IS SET UP ///// */}
            <Link className="posts__title" to={`/viewpost/${props.original._id}`}>
            {props.original.title}
           </Link>
            </div> },
      { Header: () => <div className="posts__tableHead">Author</div>,
        accessor: 'delete',
        minWidth: 40,
        filterable: true,
        Cell: props => <div className="posts__cell">
      {/* ///// add a second API call to get the author's user profile to pull down the avatar url. OR, maybe better to just store the avatar with the original post data? ///// */}
      {/*}  <img
              className="posts__thumb"
              src={props.original.author.ghProfile.avatar_url}
              alt={props.original.author}
            /> */}
            {props.original.author}</div>,
      //   Filter: ({filter, onChange}) => (
      //     <input
      //       onChange={event => onChange(event.target.value)}
      //       value={filter ? filter.value : ''}
      //       className="posts__filter-input"
      //       placeholder="Search..."
      //       />
      //       ),
      //   FilterMethod: (filter, row) =>
      //               row[filter.id].includes(filter.value)
      },
      { Header: () => <div className="posts__tableHead">Keywords</div>,
        accessor: 'edit',
        minWidth: 80,
        filterable: true,
        Cell: props =>
          <div className="posts__cell">
            {props.original.keywords.join(', ')}
              </div> },
      { Header: () => <div className="posts__tableHead">Date</div>,
        accessor: 'date',
        minWidth: 40,
        filterable: false,
        Cell: props => <div className="posts__cell center"> {formatDate(new Date(props.original.updated))}</div>,
      },
    ];

    return (
      <div className="container posts">
        <div className="posts__header">
          Posts
          <span className="posts__button-wrap">
            <Link to="/editpost">
              <button className="posts__button pointer" >
                New Post
              </button>
            </Link>
          </span>
        </div>
        {(!this.props.posts.entries)
          ? <Loading />
          : <div ref={(ref) => { this.componentRef = ref; }}
            className="posts__table-cont">
            <ReactTable
              className="posts__grid -striped"
              data={this.props.posts.entries}
              columns={tableColumns}
              defaultPageSize={5}
              minRows={1}
              showPageSizeOptions={false}
              defaultSorted={[
                {
                  id: "date",
                  desc: true,
                }
              ]}
              filterable
              defaultFilterMethod={(filter, row) =>
                    row[filter.id].includes(filter.value)}
            />
          </div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  posts: state.posts,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
