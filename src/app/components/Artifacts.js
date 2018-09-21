import React from 'react';
import PropTypes from 'prop-types';

import styles from '../app.css';

import FileArtifact from './FileArtifact';
import FolderArtifact from './FolderAtrifact';

const Artifacts = ({artifacts = [], padded = false}) => (
  <div>
    {artifacts.map(artifact => {
      const isFile = artifact.size !== undefined;

      return (
        <div className={padded ? styles.padded : null} key={artifact.name}>
          {isFile && <FileArtifact artifact={artifact}/>}
          {!isFile && <FolderArtifact artifact={artifact}/>}
        </div>
      );
    })}
  </div>
);

Artifacts.propTypes = {
  artifacts: PropTypes.array,
  padded: PropTypes.bool
};

export default Artifacts;
