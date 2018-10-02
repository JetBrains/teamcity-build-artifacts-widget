import React from 'react';
import PropTypes from 'prop-types';

import styles from '../app.css';

import FileArtifact from './FileArtifact';
import FolderArtifact from './FolderAtrifact';

export const isFile = artifact => artifact.size !== undefined;
export const isFolder = artifact => artifact.size === undefined;

const Artifacts = ({artifacts = [], padded = false}) => {
  const hasFolders = artifacts.some(isFolder);

  return (
    <div>
      {artifacts.map(artifact => {
        const file = isFile(artifact);

        return (
          <div className={padded ? styles.padded : null} key={artifact.name}>
            {file && <FileArtifact spacing={hasFolders || padded} artifact={artifact}/>}
            {!file && <FolderArtifact artifact={artifact}/>}
          </div>
        );
      })}
    </div>
  );
};

Artifacts.propTypes = {
  artifacts: PropTypes.array,
  buildInfo: PropTypes.object,
  padded: PropTypes.bool
};

export default Artifacts;
