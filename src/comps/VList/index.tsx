import React, { useEffect, useState } from "react";
import VirtualList, { Props } from "react-tiny-virtual-list";

type VirtualListProps = {
  data: any[];
  renderFn: any;
  loadingText?: string;
  onLoad?: Function;
};

export default function VList({
  data,
  renderFn,
  itemSize,
  onLoad,
  loadingText = "正在加载中",
}: Omit<Props, "itemCount" | "renderItem" | "height"> & VirtualListProps) {
  const [height, setHeight] = useState(712);

  const onScroll = (st, e) => {
    if (st + height >= e.target.scrollHeight - 25) {
      onLoad?.();
    }
  };

  useEffect(() => {
    const h = document.body.offsetHeight - 144;
    setHeight(h);
  }, []);

  return data?.length > 0 ? (
    <VirtualList
      width="100%"
      height={height}
      itemCount={data.length}
      itemSize={itemSize}
      onScroll={onScroll}
      renderItem={({ index, style }) => (
        <div key={index} style={style}>
          {index === data.length - 1 ? (
            <>
              {renderFn(data[index])}
              {data.length > 2 && (
                <div style={{ textAlign: "center" }}>{loadingText}</div>
              )}
            </>
          ) : (
            renderFn(data[index])
          )}
        </div>
      )}
    />
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 500,
      }}
    >
      暂无数据
    </div>
  );
}
