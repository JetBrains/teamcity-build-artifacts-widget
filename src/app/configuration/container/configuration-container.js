import {connect} from 'react-redux';

import Configuration from '../component/configuration';
import {
  cancelConfiguration,
  saveConfiguration,
  updateShowLastPinned,
  updateShowLastSuccessful
} from '../../redux/actions';

const ConfigurationContainer = connect(
  state => ({
    showLastSuccessful: state.configuration.showLastSuccessful,
    showLastPinned: state.configuration.showLastPinned
  }),
  dispatch => ({
    onShowLastSuccessfulChange: event => dispatch(updateShowLastSuccessful(event.target.checked)),
    onShowLastPinnedChange: event => dispatch(updateShowLastPinned(event.target.checked)),
    onSave: () => dispatch(saveConfiguration()),
    onCancel: () => dispatch(cancelConfiguration())
  })
)(Configuration);

ConfigurationContainer.propTypes = {};


export default ConfigurationContainer;
