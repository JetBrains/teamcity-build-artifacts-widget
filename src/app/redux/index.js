import {applyMiddleware, compose, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createReducer} from 'redux-act';

import {
  applyConfiguration,
  closeConfiguration,
  failedBuildTypesLoading,
  failedStatusLoading,
  failedTeamcityServicesLoading,
  finishedBuildTypesLoading,
  finishedStatusLoading,
  finishedTeamcityServicesLoading,
  openConfiguration,
  selectBuildType,
  selectTeamcityService,
  setInitialSettings,
  startedBuildTypesLoading,
  startedStatusLoading,
  startedTeamcityServicesLoading,
  updateExpandedFolders,
  updateRefreshPeriod,
  updateShowLastPinned,
  updateShowLastSuccessful,
  updateTags,
  updateTitle
} from './actions';

// eslint-disable-next-line no-magic-numbers
const DEFAULT_PERIOD = 300;

const reduce = createReducer({
  [setInitialSettings]: (state, {
    title,
    teamcityService,
    buildType,
    showLastSuccessful,
    showLastPinned,
    tags,
    refreshPeriod,
    artifacts
  }) => ({
    ...state,
    isInitializing: false,
    title,
    teamcityService,
    buildType,
    showLastSuccessful,
    showLastPinned,
    tags,
    refreshPeriod: refreshPeriod || DEFAULT_PERIOD,
    artifacts: artifacts || []
  }),
  [openConfiguration]: (state, isInitialConfiguration) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isConfiguring: true,
      title: state.title,
      refreshPeriod: state.refreshPeriod,
      selectedTeamcityService: state.teamcityService,
      selectedBuildType: state.buildType,
      showLastSuccessful: state.showLastSuccessful,
      showLastPinned: state.showLastPinned,
      tags: state.tags,

      isInitialConfiguration
    }
  }),
  [updateTitle]: (state, title) => ({
    ...state,
    configuration: {
      ...state.configuration,
      title
    }
  }),
  [startedTeamcityServicesLoading]: state => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingServices: true
    }
  }),
  [finishedTeamcityServicesLoading]: (state, services) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingServices: false,
      teamcityServices: services,
      serviceLoadErrorMessage: null,
      selectedTeamcityService: state.configuration.selectedTeamcityService || services[0]
    }
  }),
  [failedTeamcityServicesLoading]: (state, serviceLoadErrorMessage) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingServices: false,
      teamcityServices: [],
      serviceLoadErrorMessage
    }
  }),
  [selectTeamcityService]: (state, selectedService) => ({
    ...state,
    configuration: {
      ...state.configuration,
      selectedTeamcityService: selectedService
    }
  }),
  [startedBuildTypesLoading]: state => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingBuildTypes: true
    }
  }),
  [finishedBuildTypesLoading]: (state, projectsAndBuildTypes) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingBuildTypes: false,
      projectsAndBuildTypes,
      buildTypeLoadErrorMessage: null
    }
  }),
  [failedBuildTypesLoading]: (state, buildTypeLoadErrorMessage) => ({
    ...state,
    configuration: {
      ...state.configuration,
      isLoadingBuildTypes: false,
      projects: [],
      buildTypeLoadErrorMessage
    }
  }),
  [selectBuildType]: (state, selectedBuildType) => ({
    ...state,
    configuration: {
      ...state.configuration,
      selectedBuildType
    }
  }),
  [updateShowLastSuccessful]: (state, showLastSuccessful) => ({
    ...state,
    configuration: {
      ...state.configuration,
      showLastSuccessful
    }
  }),
  [updateShowLastPinned]: (state, showLastPinned) => ({
    ...state,
    configuration: {
      ...state.configuration,
      showLastPinned
    }
  }),
  [updateTags]: (state, tags) => ({
    ...state,
    configuration: {
      ...state.configuration,
      tags
    }
  }),
  [updateRefreshPeriod]: (state, refreshPeriod) => ({
    ...state,
    configuration: {
      ...state.configuration,
      refreshPeriod
    }
  }),
  [updateExpandedFolders]: (state, expandedFolders) => ({
    ...state,
    expandedFolders
  }),
  [applyConfiguration]: state => ({
    ...state,
    refreshPeriod: state.configuration.refreshPeriod,
    title: state.configuration.title,
    teamcityService: state.configuration.selectedTeamcityService,
    buildType: state.configuration.selectedBuildType,
    showLastSuccessful: state.configuration.showLastSuccessful,
    showLastPinned: state.configuration.showLastPinned,
    tags: state.configuration.tags
  }),
  [closeConfiguration]: state => ({
    ...state,
    configuration: {
      ...state.configuration,
      isConfiguring: false
    }
  }),
  [startedStatusLoading]: state => ({
    ...state,
    isLoadingArtifacts: true
  }),
  [finishedStatusLoading]: (state, artifacts) => ({
    ...state,
    artifacts,
    isLoadingArtifacts: false,
    artifactsLoadErrorMessage: null
  }),
  [failedStatusLoading]: (state, artifactsLoadErrorMessage) => ({
    ...state,
    artifacts: [],
    isLoadingArtifacts: false,
    artifactsLoadErrorMessage
  })
}, {
  isInitializing: true,
  title: null,
  teamcityService: {},
  buildType: null,
  showLastSuccessful: false,
  showLastPinned: false,
  tags: '',
  refreshPeriod: DEFAULT_PERIOD,

  artifacts: [],
  expandedFolders: {},
  isLoadingArtifacts: false,
  artifactsLoadErrorMessage: null,

  configuration: {
    isConfiguring: false,
    isInitialConfiguration: false,

    title: '',

    refreshPeriod: null,

    teamcityServices: [],
    isLoadingServices: false,
    selectedTeamcityService: null,
    serviceLoadErrorMessage: null,

    projectsAndBuildTypes: [],
    isLoadingBuildTypes: false,
    selectedBuildType: [],
    buildTypeLoadErrorMessage: null,

    tags: '',

    showLastSuccessful: false,
    showLastPinned: false
  }
});

export default (dashboardApi, registerWidgetApi) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(reduce, composeEnhancers(applyMiddleware(
    thunkMiddleware.withExtraArgument({dashboardApi, registerWidgetApi})
  )));
};
