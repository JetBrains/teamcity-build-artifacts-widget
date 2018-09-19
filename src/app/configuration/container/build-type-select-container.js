import {connect} from 'react-redux';

import {loadBuildTypes, selectBuildType} from '../../redux/actions';
import BuildTypeSelect from '../component/build-type-select';

const BuildTypeSelectContainer = connect(
  ({configuration}) => ({
    isLoading: configuration.isLoadingBuildTypes,
    isDisabled: configuration.selectedTeamcityService == null,
    selectedBuildType: configuration.selectedBuildType,
    projectAndBuildTypeList: configuration.projectsAndBuildTypes,
    loadError: configuration.buildTypeLoadErrorMessage
  }),
  dispatch => ({
    onBuildTypeSelect: item => dispatch(selectBuildType(item.payload)),
    onOpen: () => dispatch(loadBuildTypes())
  })
)(BuildTypeSelect);

BuildTypeSelectContainer.propTypes = {};


export default BuildTypeSelectContainer;
