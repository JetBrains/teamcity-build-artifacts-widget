import React from 'react';

import PropTypes from 'prop-types';
import prettyBytes from 'pretty-bytes';

import {FileIcon} from '@jetbrains/ring-ui/components/icon';
import Link from '@jetbrains/ring-ui/components/link/link';

import styles from '../app.css';

export default class FileArtifact extends React.Component {
  static propTypes = {
    artifact: PropTypes.object
  };

  render() {
    const {artifact} = this.props;

    return (
      <span>
        <span className={styles.fileSpacing}/>
        <FileIcon className={styles.artifactIcon} size={16}/>
        <Link href={artifact.href}>{artifact.name}</Link>
        <span className={styles.bytes}>{prettyBytes(artifact.size)}</span>
      </span>
    );
  }
}
