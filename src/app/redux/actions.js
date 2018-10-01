import {createAction} from 'redux-act';
import clone from 'clone';

import TeamcityService from '../teamcity/teamcity-service';

export const setInitialSettings = createAction('Set initial settings');
export const openConfiguration = createAction('Open configuration mode');
export const updateRefreshPeriod = createAction('Update refresh period');

export const updateTitle = createAction('Update title');

export const startedTeamcityServicesLoading =
  createAction('Started loading list of TeamCity services');
export const finishedTeamcityServicesLoading =
  createAction('Finished loading list of TeamCity services');
export const failedTeamcityServicesLoading =
  createAction('Failed to load list of TeamCity services');
export const selectTeamcityService =
  createAction('Select TeamCity service');

export const startedBuildTypesLoading =
  createAction('Started loading list of build types');
export const finishedBuildTypesLoading =
  createAction('Finished loading list of build types');
export const failedBuildTypesLoading =
  createAction('Failed to load list of build types');
export const selectBuildType =
  createAction('Add selected build type');

export const updateShowLastSuccessful =
  createAction('Toggle show last successful build checkbox');

export const updateShowLastPinned =
  createAction('Toggle show last pinned checkbox');

export const updateTags =
  createAction('Update tags');

export const applyConfiguration = createAction('Apply configuration');
export const closeConfiguration = createAction('Close configuration mode');

export const startedStatusLoading =
  createAction('Started loading project builds statuses');
export const finishedStatusLoading =
  createAction('Finished loading project builds statuses');
export const failedStatusLoading =
  createAction('Failed to load project builds statuses');

export const updateExpandedFolders =
  createAction('Update expanded state');

// eslint-disable-next-line complexity
export const loadArtifacts = (path = '') => async (dispatch, getState, {dashboardApi}) => {
  const {
    configuration: {isConfiguring},
    teamcityService,
    buildType,
    showLastSuccessful,
    showLastPinned,
    expandedFolders,
    tags,
    artifacts: storedArtifacts
  } = getState();
  if (!isConfiguring && teamcityService && buildType) {
    await dispatch(startedStatusLoading());

    const server = new TeamcityService(dashboardApi);
    try {
      const getPathCombinations = loadPath => {
        const parts = loadPath.split('/').filter(s => s);

        return [
          '',
          ...loadPath.
            split('/').
            filter(s => s).
            map((p, index) => parts.slice(0, parts.length - index).join('/'))
        ];
      };

      const getDeepNode = (objectPath, object) => {
        if (objectPath === '') {
          return object;
        }

        const parts = objectPath.split('/').filter(s => s);
        let cursor = object;

        parts.forEach(part => {
          cursor = cursor && cursor.artifacts && cursor.artifacts.find(a => a.name === part);
        });

        return cursor;
      };

      const loadByPath = async (loadPath, target) => {
        const combinations = getPathCombinations(loadPath);

        for (let i = 0; i < combinations.length; i++) {
          const leaf = combinations[i];

          const node = getDeepNode(leaf, target);

          if (node && !node.artifacts) {
            node.artifacts = await server.getArtifacts(
              teamcityService,
              buildType,
              showLastSuccessful,
              showLastPinned,
              tags,
              `/${leaf}`
            );
          }
        }

        return target;
      };

      let artifacts;

      if (path === '') {
        const loadedData = await loadByPath(path, {});

        const expandedPaths = Object.keys(expandedFolders).filter(f => !!expandedFolders[f]);

        for (let i = 0; i < expandedPaths.length; i++) {
          await loadByPath(expandedPaths[i], loadedData);
        }

        artifacts = loadedData.artifacts;
      } else {
        const loadedData = await loadByPath(path, {
          artifacts: clone(storedArtifacts)
        });

        artifacts = loadedData.artifacts;
      }

      const buildInfo = await server.getBuildInfo(
        teamcityService,
        buildType,
        showLastSuccessful,
        showLastPinned,
        tags
      );
      await dashboardApi.storeCache({artifacts, buildInfo});
      await dispatch(finishedStatusLoading({artifacts, buildInfo}));
    } catch (e) {
      const error = (e.data && e.data.message) || e.message || e.toString();
      await dispatch(failedStatusLoading(error));
    }
  }
};

export const loadTeamCityServices = () => async (dispatch, getState, {dashboardApi}) => {
  await dispatch(startedTeamcityServicesLoading());
  try {
    const servicesPage = await dashboardApi.fetchHub(
      'api/rest/services', {
        query: {
          query: 'applicationName: TeamCity',
          fields: 'id,name,homeUrl',
          $skip: 0,
          $top: -1
        }
      }
    );
    await dispatch(finishedTeamcityServicesLoading(servicesPage.services || []));
  } catch (e) {
    const error = (e.data && e.data.message) || e.message || e.toString();
    const message = `Cannot load list of TeamCity services: ${error}`;
    await dispatch(failedTeamcityServicesLoading(message));
  }
};

export const loadBuildTypes = () => async (dispatch, getState, {dashboardApi}) => {
  const {configuration: {selectedTeamcityService}} = getState();
  if (selectedTeamcityService) {
    await dispatch(startedBuildTypesLoading());
    try {
      const teamcityService = new TeamcityService(dashboardApi);
      const projectsAndBuildTypes = await teamcityService.getProjects(selectedTeamcityService);
      await dispatch(finishedBuildTypesLoading(projectsAndBuildTypes));
    } catch (e) {
      const error = (e.data && e.data.message) || e.message || e.toString();
      const message = `Cannot load list of TeamCity configurations: ${error}`;
      await dispatch(failedBuildTypesLoading(message));
    }
  }
};

export const startConfiguration = isInitialConfiguration =>
  async dispatch => {
    await dispatch(openConfiguration(isInitialConfiguration));
    await dispatch(loadTeamCityServices());
  };

export const saveConfiguration = () => async (dispatch, getState, {dashboardApi}) => {
  const {
    configuration: {
      title,
      selectedTeamcityService,
      selectedBuildType,
      showLastSuccessful,
      showLastPinned,
      tags,
      refreshPeriod
    }
  } = getState();
  await dashboardApi.storeConfig({
    title,
    teamcityService: selectedTeamcityService,
    buildType: selectedBuildType && {
      id: selectedBuildType.id,
      name: selectedBuildType.name,
      path: selectedBuildType.path
    },
    showLastSuccessful,
    showLastPinned,
    tags,
    refreshPeriod
  });
  await dispatch(applyConfiguration());
  await dispatch(closeConfiguration());
  await dispatch(updateExpandedFolders({}));
  await dispatch(loadArtifacts());
};

export const cancelConfiguration = () => async (dispatch, getState, {dashboardApi}) => {
  const {configuration: {isInitialConfiguration}} = getState();
  await dispatch(closeConfiguration());
  if (isInitialConfiguration) {
    await dashboardApi.removeWidget();
  }
};

export const initWidget = () => async (dispatch, getState, {dashboardApi, registerWidgetApi}) => {
  registerWidgetApi({
    onConfigure: () => dispatch(startConfiguration(false)),
    onRefresh: () => dispatch(loadArtifacts())
  });
  const config = await dashboardApi.readConfig();
  const {
    title,
    teamcityService,
    buildType,
    showLastSuccessful,
    showLastPinned,
    tags,
    refreshPeriod
  } = config || {};
  const {result: {artifacts, buildInfo}} = ((await dashboardApi.readCache())) || {result: {}};
  await dispatch(setInitialSettings({
    title,
    teamcityService,
    buildType,
    showLastSuccessful: showLastSuccessful || false,
    showLastPinned: showLastPinned || false,
    tags,
    refreshPeriod,
    artifacts,
    buildInfo
  }));
  await dispatch(loadArtifacts());
  if (!config) {
    await dispatch(startConfiguration(true));
  }
};
