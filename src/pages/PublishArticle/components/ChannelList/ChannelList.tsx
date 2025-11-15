import { useEffect, useState } from "react";
import { fetchChannelList } from "@/apis/channelApi";
import type { ChannelSimple } from "@/types/Channel";
import styles from "./ChannelList.module.scss";
//导入图片
import channelImage from "@/assets/默认频道图片.jpg";
import clsx from "clsx";

const ChannelList = ({ onChannelClick }: { onChannelClick: (id: number) => void }) => {
  const [channels, setChannels] = useState<ChannelSimple[]>([]);
  const [activeId, setActiveId] = useState<number | string | null>(null);
  useEffect(() => {
    fetchChannelList().then(setChannels);
  }, []);

  const handleClick = (id: number) => {
    setActiveId(id);
    if (onChannelClick) onChannelClick(id);

  };

  return (
    <div className={styles.channelList}>
      {channels.map((c) => (
        <div
          className={
            clsx(
              styles.channelItem,
              { [styles.active]: activeId === c.id })}
          key={c.id}
          onClick={() => handleClick(c.id)}
        >
          <img className={styles.channelImg} src={c.imageUrl || channelImage} alt={c.channelname} />
          <span className={styles.channelName}>{c.channelname}</span>
        </div>
      ))}
    </div>
  );
};

export default ChannelList; 