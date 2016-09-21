import '../../Root.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loginAutomaticallyIfPossible } from 'app/actions/UserActions';
import { toggleSearch } from 'app/actions/SearchActions';
import Header from 'app/components/Header';
import Footer from 'app/components/Footer';
import NotificationContainer from 'app/components/NotificationContainer';

class App extends Component {
  componentWillMount() {
    this.props.loginAutomaticallyIfPossible();
  }

  render() {
    return (
      <div style={this.props.searchOpen ? { WebkitFilter: 'blur(10px)' } : null}>
        <Header
          searchOpen={this.props.searchOpen}
          toggleSearch={this.props.toggleSearch}
        />

        <div style={{ flex: 1 }}>
          <NotificationContainer />
          {this.props.children}
          </div>

        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchOpen: state.search.open
  };
}

const mapDispatchToProps = {
  loginAutomaticallyIfPossible,
  toggleSearch
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
