export enum MediaType {
  PICTURE = 1,
  VIDEO,
  AUDIO,
}

export enum GenderType {
  MALE = 1,
  FEMALE,
}

export const reportEnum = {
  WEIPINGGU: {
    label: "未评估",
    value: 1,
    color: "#FA541C",
    bgColor: "#FFF2E8",
  },
  YIFASONG: {
    label: "已发送",
    value: 3,
    color: "#606972",
    bgColor: "#F5F7FB",
  },
  DAISHENHE: {
    label: "评估待审核",
    value: 13,
    color: "#49B9AD",
    bgColor: "#E2FFF8",
  },
  BUTONGGUO: {
    label: "审核不通过待修改",
    value: 14,
    color: "#A88E46",
    bgColor: "#FEFBF1",
  },
  DAIFASONG: {
    label: "审核通过待发送",
    value: 51,
    color: "#FA541C",
    bgColor: "#FFF2E8",
  },
};
