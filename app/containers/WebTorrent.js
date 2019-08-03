import {connect} from 'react-redux';
import type { stateType } from '../reducers/types';
import WebTorrentPage from '../components/WebTorrentPage';

function mapStateToProps(state: stateType) {
  console.log(state);
  const arr = [];
  state.webTorrent.tracked.forEach(t => arr.push(t));
  return {
    torrents: arr
  }
}

function mapDispatchToProps() {
 return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(WebTorrentPage);
