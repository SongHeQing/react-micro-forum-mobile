import request from "@/utils/request";
import type { ChannelList } from "@/types/channel";

export function fetchChannelList(): Promise<ChannelList> {
  return request.get("/channels");
} 