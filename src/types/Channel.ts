export type Channel = {
  id: number;
  channelname: string;
  image?: string | null;
  user_conut: number;
  create_time: string;
  update_time: string;
};

export type ChannelList = Channel[]; 