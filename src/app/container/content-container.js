import {connect} from 'react-redux';

import Content from '../content';
import {startConfiguration} from '../redux/actions';

const ContentContainer = connect(
  state => ({
    isInitializing: state.isInitializing,
    teamcityService: state.teamcityService,
    buildType: state.buildType,
    artifacts: state.artifacts,
    artifactsLoadErrorMessage: state.artifactsLoadErrorMessage
  }),
  dispatch => ({
    onConfigure: () => dispatch(startConfiguration(false))
  })
)(Content);

ContentContainer.propTypes = {};

export default ContentContainer;
