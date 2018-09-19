import {connect} from 'react-redux';

import Input, {Size as InputSize} from '@jetbrains/ring-ui/components/input/input';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import {updateTags} from '../../redux/actions';


const TagsInputContainer = connect(
  state => ({
    label: i18n('Build with specified tags (comma-separated)'),
    'data-test': 'widget-tags',
    value: state.configuration.tags,
    size: InputSize.AUTO
  }),
  dispatch => ({
    onChange: event => dispatch(updateTags(event.target.value))
  })
)(Input);

TagsInputContainer.propTypes = {};

export default TagsInputContainer;
