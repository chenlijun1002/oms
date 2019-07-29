import React, { PureComponent } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import NotFound from '../../Exception/404';
import { getRoutes } from '../../../utils/utils';

export default class XcxVersion extends PureComponent {
  render() {
    const { match, routerData } = this.props;
    return (
      <Switch>
        {getRoutes(match.path, routerData).map(item => (
          <Route
            key={item.key}
            path={item.path}
            component={item.component}
            exact={item.exact}
          />
        ))}
        <Redirect exact from="/wxaIndex/versionManage" to="/wxaIndex/versionManage/manage" />
        <Route render={NotFound} />
      </Switch>
    );
  }
}
