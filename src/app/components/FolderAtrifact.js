import React from 'react';

import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';

import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon
} from '@jetbrains/ring-ui/components/icon';
import Link from '@jetbrains/ring-ui/components/link/link';

import {loadArtifacts} from '../redux/actions';

import styles from '../app.css';

import Artifacts from './Artifacts';

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
      this.props.onLoadMore(artifact.children.href.split('/children')[1]);
    }

    this.setState({opened: !opened});
  };

  render() {
    const {artifact} = this.props;
    const {opened} = this.state;

    const Icon = opened ? ChevronDownIcon : ChevronRightIcon;

    return (
      <div onClick={this.loadMore}>
        <Icon className={styles.artifactIcon} size={16} color={'#ddd'}/>
        <FolderIcon className={styles.artifactIcon} size={16} color={'#ddd'}/>
        <Link>{artifact.name}</Link>
        {opened && <Artifacts padded artifacts={artifact.artifacts}/>}
      </div>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    onLoadMore: path => dispatch(loadArtifacts(path))
  })
)(FolderArtifact);
