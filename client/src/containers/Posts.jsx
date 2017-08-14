import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';

import * as Actions from '../store/actions/postActions';
import * as apiActions from '../store/actions/apiActions';
import { formatDate } from '../utils/';
import Loading from '../containers/Loading';

class Posts extends React.Component {

  componentDidMount() {
    this.props.api.getAllPosts(this.props.appState.authToken);
    /* axios.get('https://co-ment.glitch.me/api/posts', {
      headers: {
        Authorization: `Bearer ${this.props.appState.authToken}`,
      },
    })
    .then((response) => {
      this.props.actions.setPosts(response.data);
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
    */
  }

  render() {
    if (this.props.posts.addingPost || this.props.posts.savingPost || this.props.posts.gettingAllPosts) {
      return (
        <div className="container">
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
          <Loading text="Fetching Posts" />
        </div>
      );
    }
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
      const searchCriteria = this.props.posts.searchCriteria;
      const tableColumns = [
        { Header: () => <div className="posts__tableHead">Role</div>,
          accessor: 'role',
          minWidth: 40,
          filterable: true,
          Cell: props => (
            <div className="posts__cell">
              {props.original.role}
            </div>
          ),
          Filter: ({ filter = searchCriteria.role, onChange }) => (
            <select
              onChange={event => onChange(event.target.value)}
              style={{ width: '100%' }}
              value={filter ? filter.value : ''}
            >
              <option value="">All</option>
              <option value="mentor">Mentor</option>
              <option value="mentee">Mentee</option>
            </select>
          ),
        // Filter: makePlaceholderFilter('Search...')
        },
        { Header: () => <div className="posts__tableHead">Title</div>,
          accessor: 'title',
          minWidth: 120,
          Cell: props => (
            <div className="posts__cell">
              <Link className="posts__title" to={`/viewpost/${props.original._id}`}>
                {props.original.title}
              </Link>
            </div>
          ),
        },
        { Header: () => <div className="posts__tableHead">Author</div>,
          accessor: 'author',
          minWidth: 40,
          filterable: true,
          Cell: (props) => {
            const url = (this.props.appState.userId === props.original.author_id ? '/profile' : `/viewprofile/${props.original.author_id}`);
            return (
              <div className="posts__cell">
                <Link to={`${url}`}>
                  {props.original.author}
                </Link>
              </div>
            );
          },
      //   FilterMethod: (filter, row) =>
      //               row[filter.id].includes(filter.value)
        },
        { Header: () => <div className="posts__tableHead">Keywords</div>,
          accessor: 'keywords',
          minWidth: 80,
          filterable: true,
          Cell: props => (
            <div className="posts__cell">
              {props.original.keywords && props.original.keywords.join(', ')}
            </div>
          ),
        },
        { Header: () => <div className="posts__tableHead">Date</div>,
          accessor: 'date',
          minWidth: 40,
          filterable: false,
          Cell: props => <div className="posts__cell center"> {formatDate(new Date(props.original.updatedAt))}</div>,
        },
      ];

    return (
      <div className="container posts">
        <div className="posts__header">
          Posts
          <span className="posts__button-wrap">
            <Link to="/editpost">
              <button className="posts__button pointer" aria-label="New Post" >
                <span className="posts__btn--big">New Post</span>
                <span className="posts__btn--sm">+</span>
              </button>
            </Link>
          </span>
        </div>
        {(!this.props.posts.entries)
          ? <Loading />
          : <div
            ref={(ref) => { this.componentRef = ref; }}
            className="posts__table-cont"
          >
            <ReactTable
              className="posts__grid -striped"
              data={this.props.posts.entries}
              columns={tableColumns}
              defaultPageSize={5}
              minRows={1}
              showPageSizeOptions={false}
              defaultSorted={[
                {
                  id: 'date',
                  desc: true,
                },
              ]}
              filterable
              defaultFilterMethod={(filter, row) => {
                if (filter.id === 'keywords') {
                  return row[filter.id].includes(filter.value);
                }
                return row[filter.id].toUpperCase().includes(filter.value.toUpperCase());
              }}
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
  api: bindActionCreators(apiActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
