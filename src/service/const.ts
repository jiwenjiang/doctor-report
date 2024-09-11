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
  JISUANZHONG: {
    label: "计算中",
    value: 2,
    color: "#FA541C",
    bgColor: "#FFF2E8",
  },
  YIFASONG: {
    label: "已发送",
    value: 3,
    color: "#606972",
    bgColor: "#F5F7FB",
  },
  DAISHANGCHUAN: {
    label: "待上传",
    value: 6,
    color: "#606972",
    bgColor: "#F5F7FB",
  },
  DAIPAIBAN: {
    label: "待排班",
    value: 7,
    color: "#606972",
    bgColor: "#F5F7FB",
  },
  YIPAIBAN: {
    label: "已排班",
    value: 9,
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
    value: 15,
    color: "#FA541C",
    bgColor: "#FFF2E8",
  },
  YIQUXIAO: {
    label: "已取消",
    value: 20,
    color: "#FA541C",
    bgColor: "#FFF2E8",
  },
  YIWANCHENG: {
    label: "已完成",
    value: 21,
    color: "#00BF83",
    bgColor: "#E2FFF8",
  },
  YIZUOFEI: {
    label: "已退费",
    value: 25,
    color: "#FA541C",
    bgColor: "#FFF2E8",
  },
};

export const orderEnum = {
  DAIZHIFU: {
    label: "待支付",
    value: 1,
    color: "#FA541C",
    bgColor: "#FFF2E8",
  },
  YIFUKUAN: {
    label: "已付款",
    value: 2,
    color: "#49B9AD",
    bgColor: "#E2FFF8",
  },
  YISHIYONG: {
    label: "已使用",
    value: 3,
    color: "#00BF83",
    bgColor: "#E2FFF8",
  },
  YIQUXIAO: {
    label: "已取消",
    value: 4,
    color: "#606972",
    bgColor: "#F5F7FB",
  },
};
