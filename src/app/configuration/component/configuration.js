import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {i18n} from 'hub-dashboard-addons/dist/localization';

import Checkbox from '@jetbrains/ring-ui/components/checkbox/checkbox';
import ConfigurationForm from '@jetbrains/hub-widget-ui/dist/configuration-form';

import RefreshPeriodContainer from '../container/refresh-period-container';
import TitleInputContainer from '../container/title-input-container';
import ServiceSelectContainer from '../container/service-select-container';
import BuildTypeSelectContainer from '../container/build-type-select-container';
import TagsInputContainer from '../container/tags-input-container';
import BranchInputContainer from '../container/branch-input-container';

import styles from './configuration.css';

const Configuration = (
  {
    showLastSuccessful,
    onShowLastSuccessfulChange,

    showLastPinned,
    onShowLastPinnedChange,

    onSave,
    onCancel
  }
) => (
  <ConfigurationForm
    saveButtonLabel={i18n('Save')}
    onSave={onSave}

    cancelButtonLabel={i18n('Cancel')}
    onCancel={onCancel}

    panelControls={[<span key={'refresh'}><RefreshPeriodContainer/></span>]}
  >
    <TitleInputContainer/>

    <div className={styles.container} data-test="service-select">
      <ServiceSelectContainer/>
    </div>

    <div className={styles.container} data-test="configuration-select">
      <BuildTypeSelectContainer/>
    </div>

    <TagsInputContainer/>

    <BranchInputContainer/>

    <div
      className={classNames(styles.control, styles.controlFirst)}
      data-test="show-last-successful"
    >
      <Checkbox
        label={i18n('Show last successful build')}
        checked={showLastSuccessful}
        onChange={onShowLastSuccessfulChange}
      />
    </div>

    <div
      className={styles.control}
      data-test="hide-last-pinned"
    >
      <Checkbox
        label={i18n('Show last pinned build')}
        checked={showLastPinned}
        onChange={onShowLastPinnedChange}
      />
    </div>
  </ConfigurationForm>
);

Configuration.propTypes = {
  showLastSuccessful: PropTypes.bool.isRequired,
  onShowLastSuccessfulChange: PropTypes.func.isRequired,

  showLastPinned: PropTypes.bool.isRequired,
  onShowLastPinnedChange: PropTypes.func.isRequired,

  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default Configuration;
