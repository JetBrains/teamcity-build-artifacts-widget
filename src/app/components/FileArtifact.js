import React from 'react';
import connect from 'react-redux/es/connect/connect';

import PropTypes from 'prop-types';

import {FileIcon} from '@jetbrains/ring-ui/components/icon';
import Link from '@jetbrains/ring-ui/components/link/link';

import styles from '../app.css';

const fileSize = bytes => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`; //eslint-disable-line no-magic-numbers
};

class FileArtifact extends React.Component {
  static propTypes = {
    artifact: PropTypes.object.isRequired,
    spacing: PropTypes.bool.isRequired,
    teamcityService: PropTypes.object.isRequired
  };

  render() {
    const {artifact, spacing, teamcityService} = this.props;

    return (
      <span>
        {spacing && <span className={styles.fileSpacing}/>}
        <FileIcon className={styles.artifactIcon} size={16}/>
        <Link href={teamcityService.homeUrl + artifact.content.href}>{artifact.name}</Link>
        <span className={styles.bytes}>{fileSize(artifact.size)}</span>
      </span>
    );
  }
}

export default connect(
  state => ({
    teamcityService: state.teamcityService
  })
)(FileArtifact);
