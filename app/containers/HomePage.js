import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import type { stateType as State } from '../reducers/types';
import * as Actions from '../actions/weeb';
import {download} from '../actions/webtorrent';

function mapStateToProps(state: State) {
  return {
    torrents: state.nyaa.torrents,
    loading: state.nyaa.loading
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...Actions, downloadTorrent: download}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
