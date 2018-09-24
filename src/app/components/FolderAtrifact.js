import React from 'react';

import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';

import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon
} from '@jetbrains/ring-ui/components/icon';
import Link from '@jetbrains/ring-ui/components/link/link';
import LoaderInline from '@jetbrains/ring-ui/components/loader-inline/loader-inline';

import {loadArtifacts, updateExpandedFolders} from '../redux/actions';

import styles from '../app.css';

import Artifacts from './Artifacts';

const FOLDER_STATE = {
  COLLAPSED: undefined,
  LOADING: 1,
  EXPANDED: 2
};

class FolderArtifact extends React.Component {
  static propTypes = {
    artifact: PropTypes.object,
    updateExpanded: PropTypes.func,
    onLoadMore: PropTypes.func,
    expandedFolders: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.path = props.artifact.children.href.split('/children')[1];
  }

  // async componentDidUpdate(prevProps) {
  //   if (!this.props.artifact.artifacts && prevProps.artifact.artifacts) {
  //     this.setExpandedState(FOLDER_STATE.LOADING);
  //     await this.props.onLoadMore(this.path);
  //     this.setExpandedState(FOLDER_STATE.EXPANDED);
  //   }
  // }

  getExpandedState = () => this.props.expandedFolders[this.path];

  setExpandedState = expandedState =>
    this.props.updateExpanded({
      ...this.props.expandedFolders,
      [this.path]: expandedState
    });

  toggleFolder = async () => {
    const {artifact, onLoadMore} = this.props;
    const folderState = this.getExpandedState();

    if (folderState === FOLDER_STATE.LOADING) {
      return;
    }

    if (folderState === FOLDER_STATE.COLLAPSED) {
      if (!artifact.artifacts) {
        this.setExpandedState(FOLDER_STATE.LOADING);
        await onLoadMore(this.path);
      }

      this.setExpandedState(FOLDER_STATE.EXPANDED);
    } else {
      this.setExpandedState(FOLDER_STATE.COLLAPSED);
    }
  };

  render() {
    const {artifact} = this.props;
    const folderState = this.getExpandedState();

    const loading = folderState === FOLDER_STATE.LOADING;
    const expanded = folderState === FOLDER_STATE.EXPANDED;

    const Icon = expanded ? ChevronDownIcon : ChevronRightIcon;

    return (
      <div>
        <span onClick={this.toggleFolder}>
          <span className={styles.artifactIcon}>
            <Icon size={16} color={'#ddd'}/>
            <FolderIcon size={16} color={'#ddd'}/>
          </span>
          <Link className={styles.link}>{artifact.name}</Link>
        </span>
        {expanded && <Artifacts padded artifacts={artifact.artifacts}/>}
        {loading && <LoaderInline className={styles.folderLoader}/>}
      </div>
    );
  }
}

export default connect(
  state => ({
    expandedFolders: state.expandedFolders
  }),
  dispatch => ({
    onLoadMore: path => dispatch(loadArtifacts(path)),
    updateExpanded: expanded => dispatch(updateExpandedFolders(expanded))
  })
)(FolderArtifact);
