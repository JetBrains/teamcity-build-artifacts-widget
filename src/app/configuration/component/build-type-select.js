import React from 'react';
import PropTypes from 'prop-types';
import Select from '@jetbrains/ring-ui/components/select/select';
import {MinWidth} from '@jetbrains/ring-ui/components/popup/position';
import {i18n} from 'hub-dashboard-addons/dist/localization';

function buildType2Item(projectOrBuildType) {
  return projectOrBuildType && {
    key: projectOrBuildType.id,
    label: projectOrBuildType.name,
    // eslint-disable-next-line no-magic-numbers
    level: projectOrBuildType.level * 2,
    payload: projectOrBuildType,
    disabled: !projectOrBuildType.isBuildType
  };
}

function isMatching(projectOrBuildType, query) {
  return !query ||
    query === '' ||
    projectOrBuildType.path.toLowerCase().includes(query.toLowerCase());
}

function anyIsMatching(projectOrBuildTypeList, query) {
  return projectOrBuildTypeList.some(it =>
    isMatching(it, query) ||
    (it.children && anyIsMatching(it.children, query)) ||
    (it.buildTypes && anyIsMatching(it.buildTypes, query)));
}

const filter = {
  placeholder: i18n('Filter projects and build configurations'),
  fn: ({payload}, query) => !query || anyIsMatching([payload], query.replace(/\s*((::\s*)|(:$))/g, ' :: '))
};

const BuildTypeSelect =
  (
    {
      isLoading,
      isDisabled,
      selectedBuildType,
      projectAndBuildTypeList,
      loadError,
      onBuildTypeSelect,
      onOpen
    }
  ) => (
    <Select
      selectedLabel={i18n('Build configurations')}
      label={i18n('All build configurations')}
      multiple={false}
      loading={isLoading}
      disabled={isDisabled}
      filter={filter}
      selected={selectedBuildType && buildType2Item(selectedBuildType)}
      size={Select.Size.FULL}
      minWidth={MinWidth.TARGET}
      data={(projectAndBuildTypeList || []).map(buildType2Item)}
      notFoundMessage={loadError}
      onSelect={onBuildTypeSelect}
      onOpen={onOpen}
    />
  );

const TREE_NODE_PROPS = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  level: PropTypes.number,
  parent: PropTypes.object,
  isBuildType: PropTypes.bool
};

BuildTypeSelect.propTypes = {
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  selectedBuildType: PropTypes.shape(TREE_NODE_PROPS),
  projectAndBuildTypeList: PropTypes.arrayOf(PropTypes.shape(TREE_NODE_PROPS)),
  loadError: PropTypes.string,
  onBuildTypeSelect: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired
};

export default BuildTypeSelect;
