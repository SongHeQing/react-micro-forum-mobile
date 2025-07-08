import { useEffect, useState } from "react";
import { fetchChannelList } from "@/api/channelApi";
import type { Channel } from "@/types/channel";
import { Space, Avatar } from "antd-mobile";

const ChannelListAntd = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  useEffect(() => {
    fetchChannelList().then(setChannels);
  }, []);

  return (
    <Space wrap style={{ gap: '3.8vw', padding: '2.6vw' }}>
      {channels.map((c) => (
        <div
          key={c.id}
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f5f7fa",
            borderRadius: "3.2vw",
            padding: "1vw 2.8vw 1vw 1vw",
            fontSize: "2.6vw",
            marginRight: 0,
            boxSizing: 'border-box',
            minWidth: '0',
            maxWidth: '80vw',
          }}
        >
          <Avatar src={c.image || ''} style={{ '--size': '5.8vw', marginRight: '1.2vw', flexShrink: 0 }} />
          <span style={{ color: "#4a90e2", fontWeight: 500, fontSize: '2.6vw', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.channelname}</span>
        </div>
      ))}
    </Space>
  );
};

export default ChannelListAntd; 