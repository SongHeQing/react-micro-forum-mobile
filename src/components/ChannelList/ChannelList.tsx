import { useEffect, useState } from "react";
import { fetchChannelList } from "@/api/channelApi";
import type { Channel } from "@/types/channel";
import styles from "./ChannelList.module.css";

const ChannelList = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  useEffect(() => {
    fetchChannelList().then(setChannels);
  }, []);

  return (
    <div className={styles.channelList}>
      {channels.map((c) => (
        <div className={styles.channelItem} key={c.id}>
          <img className={styles.channelImg} src={c.image || ''} alt={c.channelname} />
          <span className={styles.channelName}>{c.channelname}</span>
        </div>
      ))}
    </div>
  );
};

export default ChannelList; 