/* eslint-disable no-magic-numbers */
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';


import Link from '@jetbrains/ring-ui/components/link/link';
import Icon, {Size} from '@jetbrains/ring-ui/components/icon/icon';
import {SuccessIcon, WarningIcon} from '@jetbrains/ring-ui/components/icon/icons';

import styles from '../app.css';


const TC_TIMESTAMP_REGEXP = /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})([-+]\d+)/;

function toDate(tcTimestamp) {
  const jsTimestamp = tcTimestamp.replace(TC_TIMESTAMP_REGEXP, '$1-$2-$3T$4:$5:$6$7');
  return new Date(jsTimestamp);
}

function buildDuration(build) {
  const start = toDate(build.startDate);
  const finish = toDate(build.finishDate);
  const durationMillis = finish.getTime() - start.getTime();
  const sec = Math.floor(durationMillis / 1000) % 60;
  const min = Math.floor(durationMillis / (60 * 1000)) % 60;
  const hour = Math.floor(durationMillis / (60 * 60 * 1000));
  if (hour !== 0) {
    return `${hour}h:${min}m:${sec}s`;
  } else if (min !== 0) {
    return `${min}m:${sec}s`;
  } else {
    return `${sec}s`;
  }
}

function buildTimestamp(build) {
  return build.finishDate && toDate(build.finishDate).toLocaleString();
}

const BuildStatus = ({build}) => {
  const isSuccessful = build.status === 'SUCCESS';
  return (
    <div className={styles.build} data-test="build">
      <div className={styles.status}>
        <span title={build.statusText} data-test="build-status">
          <Icon
            className={classNames(styles.icon, isSuccessful ? styles.ok : styles.fail)}
            glyph={isSuccessful ? SuccessIcon : WarningIcon}
            size={Size.Size12}
            data-test="build-status-icon"
          />
          <Link
            target="_top"
            href={build.webUrl}
            data-test="build-number"
          >{`#${build.number}`}</Link>
          &nbsp;
          <span
            className={styles.buildTime}
            title={buildTimestamp(build)}
            data-test="build-duration"
          >{buildDuration(build)}</span>
        </span>
      </div>
    </div>
  );
};

BuildStatus.propTypes = {
  build: PropTypes.object.isRequired
};

export default BuildStatus;
