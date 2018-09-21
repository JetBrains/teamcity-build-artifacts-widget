import React from 'react';
import PropTypes from 'prop-types';

import FileArtifact from './FileArtifact';
import FolderArtifact from './FolderAtrifact';

const Artifacts = ({artifacts}) => (
  <div>
    {artifacts.map(artifact => {
      const isFile = artifact.size !== undefined;

      return (
        <div key={artifact.name}>
          {isFile && <FileArtifact artifact={artifact}/>}
          {!isFile && <FolderArtifact artifact={artifact}/>}
        </div>
      );
    })}
  </div>
);

Artifacts.propTypes = {
  artifacts: PropTypes.array
};

export default Artifacts;
