import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import styles from '../app.css';

import FileArtifact from './FileArtifact';
import FolderArtifact from './FolderAtrifact';
import BuildStatus from './BuidStatus';

const Artifacts = ({artifacts = [], buildInfo = {}, padded = false}) => (
  <div>
    <BuildStatus
      build={buildInfo}
    />

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
  buildInfo: PropTypes.object,
  padded: PropTypes.bool
};

export default connect(
  state => ({
    buildInfo: state.buildInfo
  })
)(Artifacts);
