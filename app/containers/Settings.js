import {useDispatch} from "react-redux";
import {useEffect} from "react";

import Channel from '../utils/channel';
import {refreshSettings} from "../actions/settings";


export function SettingsConnector(): null {
  const dispatch = useDispatch();
  const channel = new Channel('settings');
  useEffect(() => {
    (async () => {
      const settings = await channel.request({command: 'read'});
      dispatch(refreshSettings(settings));
    })();
  }, []);

  return null;
}
