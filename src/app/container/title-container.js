import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {i18n} from 'hub-dashboard-addons/dist/localization';

import WidgetTitle from '@jetbrains/hub-widget-ui/dist/widget-title';

const TitleContainer = connect(
  (state, {dashboardApi}) => (state.configuration.isConfiguring
    ? {
      title: i18n('Artifacts'),
      counter: -1,
      href: null,
      dashboardApi
    }
    : {
      title: state.title ||
        (state.buildType
          ? i18n('Artifacts: {{ buildConfiguration }}', {buildConfiguration: state.buildType.path})
          : i18n('Artifacts')),
      counter: -1,
      href: state.buildType &&
        state.buildType.id &&
        `${state.teamcityService.homeUrl}/viewType.html?buildTypeId=${state.buildType.id}`,
      dashboardApi
    })
)(WidgetTitle);

TitleContainer.propTypes = {
  dashboardApi: PropTypes.object.isRequired
};

export default TitleContainer;
