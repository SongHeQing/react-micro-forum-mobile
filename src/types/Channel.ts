export type ChannelSimple = {
  id: number;
  channelname: string;
  imageUrl?: string | null;

};

export type Channel = {
  id: number;
  channelname: string;
  imageUrl?: string | null;
  backgroundUrl?: string | null;
  dominantColor?: string | null;
  description?: string | null;
  detail?: string | null;
  userCount: number;
  articleCount: number;
}

export type ChannelSimpleList = ChannelSimple[];