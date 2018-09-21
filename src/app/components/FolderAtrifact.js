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
      const path = artifact.children.href.split('/children')[1];
      this.props.onLoadMore(path);
    }

    this.setState({opened: !opened});
  };

  render() {
    const {artifact} = this.props;
    const {opened} = this.state;

    const Icon = opened ? ChevronDownIcon : ChevronRightIcon;

    return (
      <div>
        <span onClick={this.loadMore}>
          <span className={styles.artifactIcon}>
            <Icon size={16} color={'#ddd'}/>
            <FolderIcon size={16} color={'#ddd'}/>
          </span>
          <Link>{artifact.name}</Link>
        </span>
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
