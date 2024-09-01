import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabbar } from 'react-vant';

import styles from './index.module.less';

function FTabbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const change = (e) => {
    navigate(e);
  };

  return (
    <div className={styles.box}>
      <Tabbar
        inactiveColor="#181818"
        safeAreaInsetBottom={true}
        value={location.pathname}
        onChange={change}>
        <Tabbar.Item icon="bar-chart-o" name="/records">
          训练记录
        </Tabbar.Item>
        <Tabbar.Item icon="notes-o" name="/course">
          我的课程
        </Tabbar.Item>
        <Tabbar.Item icon="user-circle-o" name="/mine">
          个人资料
        </Tabbar.Item>
      </Tabbar>
    </div>
  );
}

export default FTabbar;
