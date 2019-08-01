import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Home from '../components/Home'
import type {stateType as State} from '../reducers/types'
import * as Actions from '../actions/weeb'

function mapStateToProps(state: State) {
  return {
    torrents: state.torrents
  }
}

function mapDispatchToProps(dispatch) {
  const a = bindActionCreators(Actions, dispatch);
  return a;
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
