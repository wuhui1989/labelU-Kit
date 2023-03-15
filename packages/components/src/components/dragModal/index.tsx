import { Modal } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface Iprops {
  // 弹框左上角位置
  width: number;
  height?: number;
  content: React.ReactElement;
  title?: string;
  okWord: string;
  cancelWord: string;
  okEvent?: () => void;
  cancelEvent?: () => void;
  closable?: boolean;
  isSetPosition?: boolean;
}

interface Bounds {
  left: number;
  top: number;
}

const DrageModel = (props: Iprops, ref: any) => {
  const { title, okWord, content, cancelWord, closable = true } = props;

  const [isVisble, setIsVisible] = useState(false);
  //   const [coordinate,setCoordinate] = useState<Coordinate>({
  //     x:100,
  //     y:100
  //   })
  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState<Bounds>({
    left: 0,
    top: 0,
  });

  const handleOk = (e: any) => {
    setIsVisible(false);
  };

  const handleCancel = (e: any) => {
    props?.cancelEvent?.();
    setIsVisible(false);
  };

  useImperativeHandle(ref, () => ({
    switchModal: (isVisible: boolean) => {
      setIsVisible(isVisible);
    },
    switchSetBounds: (bounds: Bounds) => {
      setBounds(bounds);
    },
  }));

  useEffect(() => {
    if (document.getElementsByClassName('ant-modal-content').length > 0) {
      const bundingRect = document
        .getElementsByClassName('ant-modal-content')[0]
        .getBoundingClientRect();
      const maxTop = window.innerHeight - bundingRect.height;
      const maxleft = window.innerWidth - bundingRect.width;

      if (bounds.top > maxTop) {
        document.body.onmousemove = null;
        setBounds({
          ...bounds,
          top: maxTop,
        });
      }

      if (bounds.left > maxleft) {
        document.body.onmousemove = null;
        setBounds({
          ...bounds,
          left: maxleft,
        });
      }

      if (bounds.left < 0) {
        document.body.onmousemove = null;
        setBounds({
          ...bounds,
          left: 0,
        });
      }
    }
  }, [bounds, props]);

  // 计算是否超出屏幕;超出后
  const inWindow = (left: number, top: number, startPosX: number, startPosY: number) => {
    let H = document.body.clientHeight;
    let W = document.body.clientWidth;
    if (
      (left < 20 && startPosX > left) ||
      (left > W - 20 && startPosX < left) ||
      (top < 20 && startPosY > top) ||
      (top > H - 20 && startPosY < top)
    ) {
      document.body.onmousemove = null;
      document.body.onmouseup = null;
      return false;
    }
    return true;
  };
  const onMouseDown = (e: { preventDefault: () => void; clientX: any; clientY: any }) => {
    e.preventDefault(); // 记录初始移动的鼠标位置
    let startPosX = e.clientX;
    let startPosY = e.clientY; // 添加鼠标移动事件
    document.body.onmousemove = (e) => {
      let left = e.clientX - startPosX + bounds.left;
      let top = e.clientY - startPosY + bounds.top;
      if (inWindow(e.clientX, e.clientY, startPosX, startPosY)) {
        setBounds({
          left: left,
          top: top,
        });
      }
    }; // 鼠标放开时去掉移动事件
    document.body.onmouseup = function () {
      document.body.onmousemove = null;
    };
  };

  if (!title) {
    return (
      <Modal
        mask={false}
        footer={null}
        style={{
          top: `${bounds.top}px`,
          left: `${bounds.left}px`,
          margin: '0px 0px',
          maxWidth: props.width,
          height: props.height,
        }}
        bodyStyle={{
          padding: '16px 12px',
        }}
        closable={closable}
        visible={isVisble}
        okText={okWord}
        cancelText={cancelWord}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {content}
      </Modal>
    );
  }

  return (
    <Modal
      mask={false}
      footer={null}
      style={{
        top: `${bounds.top}px`,
        left: `${props.isSetPosition ? bounds.left + 20 : bounds.left - props.width - 150}px`,
        margin: '0px 0px',
        maxWidth: props.width,
      }}
      title={
        <div
          onMouseDown={onMouseDown}
          style={{
            width: '100%',
            cursor: 'move',
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
        >
          {title}
        </div>
      }
      closable={closable}
      visible={isVisble}
      okText={okWord}
      cancelText={cancelWord}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {content}
    </Modal>
  );
};

export default forwardRef(DrageModel);
