import React from 'react';

import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';

import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon
} from '@jetbrains/ring-ui/components/icon';
import Link from '@jetbrains/ring-ui/components/link/link';

import {reloadArtifacts} from '../redux/actions';

import styles from '../app.css';

class FolderArtifact extends React.Component {
  static propTypes = {
    artifact: PropTypes.object,
    onLoadMore: PropTypes.func
  };

  state = {
    opened: false
  };

  loadMore = () => {
    const {artifact} = this.props;
    const {opened} = this.state;

    if (!artifact.artifacts) {
      console.log('loading', artifact.name);
      console.log(this.props.onLoadMore(artifact.name));
    } else {
      console.log('just show');
    }

    this.setState({opened: !opened});
  };

  render() {
    const {artifact} = this.props;

    const Icon = this.state.opened ? ChevronDownIcon : ChevronRightIcon;

    return (
      <span onClick={this.loadMore}>
        <Icon className={styles.artifactIcon} size={16} color={'#ddd'}/>
        <FolderIcon className={styles.artifactIcon} size={16} color={'#ddd'}/>
        <Link>{artifact.name}</Link>
      </span>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    onLoadMore: path => dispatch(reloadArtifacts(path))
  })
)(FolderArtifact);
