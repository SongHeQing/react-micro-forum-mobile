import { useEffect, useState } from "react";
import { fetchChannelList } from "@/apis/channelApi";
import type { Channel } from "@/types/channel";
import { Avatar } from "antd-mobile";
import styles from "./ChannelListAntd.module.css";

const ChannelListAntd = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  useEffect(() => {
    fetchChannelList().then(setChannels);
  }, []);

  return (
    <div className={styles.channelList}>
      {channels.map((c) => (
        <div
          key={c.id}
          className={styles.channelItem}
        >
          <Avatar src={c.image || ''} className={styles.channelAvatar} />
          <span className={styles.channelName}>{c.channelname}</span>
        </div>
      ))}
    </div>
  );
};

export default ChannelListAntd; 