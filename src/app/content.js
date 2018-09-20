import React from 'react';
import PropTypes from 'prop-types';

import prettyBytes from 'pretty-bytes';

import Link from '@jetbrains/ring-ui/components/link/link';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';
import {i18n} from 'hub-dashboard-addons/dist/localization';

import styles from './app.css';

function WidgetContent({children, testKey}) {
  return (
    <div className={styles.widget} data-test={testKey}>
      {children}
    </div>
  );
}

WidgetContent.propTypes = {
  testKey: PropTypes.string,
  children: PropTypes.node
};

const Content = (
  {
    teamcityService,
    buildType,
    artifacts,
    artifactsLoadErrorMessage,
    onConfigure
  }
) => {
  if (!teamcityService || !buildType) {
    return (
      <WidgetContent testKey={'widget-setup-pending'}>
        <span>
          {i18n('Widget setup is not finished yet.')}
          <span>{' '}</span>
          <Link onClick={onConfigure}>{i18n('Set up...')}</Link>
        </span>
      </WidgetContent>
    );
  } else if (artifactsLoadErrorMessage) {
    return (
      <WidgetContent testKey={'widget-load-error'}>
        <EmptyWidget face={EmptyWidgetFaces.ERROR}>
          {i18n('Cannot load build artifacts')}
          <br/>
          {artifactsLoadErrorMessage}
        </EmptyWidget>
      </WidgetContent>
    );
  } else if (!artifacts.length) {
    return (
      <WidgetContent testKey={'widget-no-builds'}>
        <EmptyWidget face={EmptyWidgetFaces.JOY}>{i18n('This build doesn’t contain any artifacts')}</EmptyWidget>
      </WidgetContent>
    );
  } else {
    return (
      <WidgetContent testKey={'widget-build-list'}>
        {artifacts.map(artifact => (
          <div key={artifact.name}>
            <Link href={artifact.href}>{artifact.name}</Link>
            <span className={styles.bytes}>{prettyBytes(artifact.size)}</span>
          </div>
        ))}
      </WidgetContent>
    );
  }
};

Content.propTypes = {
  teamcityService: PropTypes.object,
  buildType: PropTypes.object,
  artifacts: PropTypes.array.isRequired,
  artifactsLoadErrorMessage: PropTypes.string,
  onConfigure: PropTypes.func.isRequired
};

export default Content;
