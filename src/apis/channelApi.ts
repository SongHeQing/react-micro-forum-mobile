import request from "@/utils/request";
import type { ChannelSimpleList, Channel } from "@/types/Channel";

export function fetchChannelList(): Promise<ChannelSimpleList> {
  return request.get("/channels");
}

export function fetchChannelById(id: number): Promise<Channel> {
  return request.get(`/channels/${id}`);
}

export function createChannel(formData: FormData): Promise<Channel> {
  return request.post("/channels", formData);
}