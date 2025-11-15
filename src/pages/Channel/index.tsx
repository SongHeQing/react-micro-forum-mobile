import { useNavigate, useParams } from "react-router";
import styles from "./index.module.scss";
import DragDownPanel from "./components/DragDownPanel";
import { useEffect, useState } from "react";
import { fetchChannelById } from "@/apis/channelApi";
import type { Channel } from "@/types";
import channelImage from "@/assets/默认频道图片.jpg";
const Channel = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [channelInfo, setChannelInfo] = useState<Channel | null>(null);
  useEffect(() => {
    fetchChannelById(Number(id)).then((res) => {
      setChannelInfo(res);
    })
  }, [id]);
  return (
    <div className={styles.channel}>
      {/* 上栏 */}
      <div className={styles.channelTop}>
        <div className={styles.left}>
          <svg className={styles.icon}
            onClick={() => navigate(-1)}
            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1744" ><path d="M376.235 512l356.382-356.382c15.621-15.621 15.621-40.948 0-56.568-15.621-15.621-40.947-15.621-56.568 0L291.383 483.716c-15.621 15.621-15.621 40.947 0 56.568L676.049 924.95c15.621 15.621 40.947 15.621 56.568 0s15.621-40.947 0-56.568L376.235 512z" p-id="1745"></path></svg>
          <div className={styles.channelSimpleInfo}>
            <img className={styles.channelImage} src={channelInfo?.imageUrl || channelImage} alt={channelInfo?.channelname} />
            <div className={styles.channelName}>{channelInfo?.channelname + "频道"}</div>

          </div>

        </div>
        <div className={styles.right}></div>
      </div>
      {/* 频道信息 */}
      <div className={styles.channelInfo}></div>
      {/* 浮动面板 */}
      <DragDownPanel channelId={Number(id)} />
    </div>
  )
}

export default Channel