import React from 'react';
import {connect} from 'react-redux';

import Configuration from '../component/configuration';
import {
  cancelConfiguration,
  saveConfiguration,
  updateShowLastPinned,
  updateShowLastSuccessful
} from '../../redux/actions';

import TitleInputContainer from './title-input-container';
import ServiceSelectContainer from './service-select-container';
import RefreshPeriodContainer from './refresh-period-container';
import BuildTypeSelectContainer from './build-type-select-container';


const ConfigurationContainer = connect(
  state => ({
    refreshPeriodControl: <RefreshPeriodContainer/>,
    titleInput: <TitleInputContainer/>,
    serviceSelect: <ServiceSelectContainer/>,
    configurationSelect: <BuildTypeSelectContainer/>,

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
