import React from 'react';
import {withRouter} from 'react-router-dom';
import NavBarContainer from '../nav_bar/nav_bar_container';
import PostBox from './post_box';
import './posts_index.scss';
import CurrentMap from '../google_maps/post_index_map';


class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchPosts();
  }

  componentWillReceiveProps(newState) {
    this.setState({ posts: newState.posts })
  }

  componentDidUpdate(prevProps, prevState) {
    if(JSON.stringify(prevState.posts) !== JSON.stringify(this.state.posts)) {
      this.props.fetchPosts();
    }
  }

  handleClick(postId){
    this.props.deletePost(postId)
      .then(this.props.fetchPosts());
  }

  goToCreate(e) {
    this.props.history.push("/posts/create")
  }

  render() {
    if (!this.state.posts) return null;
    if (this.state.posts.length === 0) {
      return (
        <div>
          <NavBarContainer/>
          <h3>There are currently no posts.</h3>
          <button onClick={(e) => this.goToCreate()}>Create a Post</button>
        </div>
      )
    } else {
      return (
        <div className="posts-container">
          <NavBarContainer />
          <h2>All Posts</h2>
          <button onClick={(e) => this.goToCreate()}>Create a Post</button>
          <div className="post-index-main-content">
            <div className="posts-index-container">
              {this.state.posts.map((post) => (
                <div>
                  <PostBox key={post.id} post={post} />
                  <button
                    disabled={
                      (!this.props.currentUser) || (this.props.currentUser.id !== post.user)
                    }
                    onClick={() => this.handleClick(post._id)}
                  >
                    Delete Post
                  </button>
                </div>
              ))}
            </div>
            <div className="maps-container">
              <CurrentMap posts={this.state.posts} />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(Posts);