import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter';

function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  const a = bindActionCreators(CounterActions, dispatch);
  return a;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);
