import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import Widget from '../widget';
import {loadArtifacts} from '../redux/actions';
import ConfigurationContainer from '../configuration/container/configuration-container';

import ContentContainer from './content-container';

const getPresentationalWidgetTitle = state => ({
  text: state.configuration.title ||
    (state.buildType
      ? i18n('Artifacts: {{ buildConfiguration }}', {buildConfiguration: state.buildType.path})
      : i18n('Artifacts')),
  counter: -1,
  href: state.buildType &&
    state.buildType.id &&
    `${state.teamcityService.homeUrl}/viewType.html?buildTypeId=${state.buildType.id}`
});

const WidgetContainer = connect(
  (state, {dashboardApi}) => ({
    isConfiguring: state.configuration.isConfiguring,
    widgetLoader: state.isLoadingArtifacts,
    // eslint-disable-next-line no-magic-numbers
    tickPeriod: state.refreshPeriod * 1000,
    dashboardApi,
    widgetTitle: state.configuration.isConfiguring
      ? i18n('Artifacts')
      : getPresentationalWidgetTitle(state),
    Configuration: ConfigurationContainer,
    Content: ContentContainer
  }),
  dispatch => ({
    onTick: () => dispatch(loadArtifacts())
  })
)(Widget);

WidgetContainer.propTypes = {
  dashboardApi: PropTypes.object.isRequired
};

export default WidgetContainer;
