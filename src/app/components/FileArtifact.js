import React from 'react';
import connect from 'react-redux/es/connect/connect';

import PropTypes from 'prop-types';
import prettyBytes from 'pretty-bytes';

import {FileIcon} from '@jetbrains/ring-ui/components/icon';
import Link from '@jetbrains/ring-ui/components/link/link';

import styles from '../app.css';

class FileArtifact extends React.Component {
  static propTypes = {
    artifact: PropTypes.object,
    teamcityService: PropTypes.object
  };

  render() {
    const {artifact, teamcityService} = this.props;

    return (
      <span>
        <span className={styles.fileSpacing}/>
        <FileIcon className={styles.artifactIcon} size={16}/>
        <Link href={teamcityService.homeUrl + artifact.content.href}>{artifact.name}</Link>
        <span className={styles.bytes}>{prettyBytes(artifact.size)}</span>
      </span>
    );
  }
}

export default connect(
  state => ({
    teamcityService: state.teamcityService
  })
)(FileArtifact);
