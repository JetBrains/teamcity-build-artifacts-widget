import {connect} from 'react-redux';

import Input, {Size as InputSize} from '@jetbrains/ring-ui/components/input/input';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import {updateBranch} from '../../redux/actions';


const BranchInputContainer = connect(
  state => {
    console.log('>>>>>', state.configuration);


    return {
      label: i18n('Custom branch name'),
      'data-test': 'branch-name-input',
      value: state.configuration.branch,
      size: InputSize.AUTO
    };
  },
  dispatch => ({
    onChange: event => dispatch(updateBranch(event.target.value))
  })
)(Input);

BranchInputContainer.propTypes = {};

export default BranchInputContainer;
