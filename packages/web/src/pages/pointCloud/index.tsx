import React, { FC, useEffect, useState } from 'react';
import Annotation from '../../components/business/annotation';
import { cloudMockFileList } from '../../mock/annotationMock';
import { useSelector, useDispatch } from 'react-redux';
import { updateToolsConfig, updateAllAttributeConfigList } from '../../stores/toolConfig.store';

import cloudToolConfig from '../../config/cloudPointConfig.json';
import { AxisUtils } from '@label-u/annotation';
const AnnotationPage: FC = () => {
  const dispatch = useDispatch();
  const { tools, attribute } = useSelector(state => state.toolsConfig);
  // const currentIsVideo = StepUtils.currentToolIsVideo(1, stepConfig);
  const [fileList, setFileList] = useState<any[]>([]);
  // 加载工具配置信息 和 文件信息
  useEffect(() => {
    // 工具配置 todo=》补充配置拉取接口
    // @ts-ignore
    dispatch(updateToolsConfig(cloudToolConfig.tools));
    dispatch(updateAllAttributeConfigList(cloudToolConfig.attribute));
    // 配置标注文件 todo=》补充文件拉取接口

    let oneLabel = {
      attribute: '大众',
      center: {
        x: -3.667189431770466,
        y: 9.819609371447392,
        z: -0.28502941131591797
      },
      id: 'go7JhqDF',
      rotation: 3.141512743038566,
      valid: true,
      width: 20.315630577533675,
      height: 13.318114349281112,
      depth: 11.110329627990723,
      zInfo: {
        maxZ: 5.270135402679443,
        minZ: -5.840194225311279,
        count: 0,
        zCount: 17212
      },
      rect: [
        {
          x: 2.9910560049913646,
          y: 19.977956756710284
        },
        {
          x: -10.327058301767032,
          y: 19.976892498853452
        },
        {
          x: -10.325434868532296,
          y: -0.33873801381550095
        },
        {
          x: 2.9926794382260997,
          y: -0.33767375595866866
        }
      ],
      order: 1,
      isVisible: true
    };
    let rsult: {
      attribute: string;
      center: { x: number; y: number; z: number };
      id: string;
      rotation: number;
      valid: boolean;
      width: number;
      height: number;
      depth: number;
      zInfo: { maxZ: number; minZ: number; count: number; zCount: number };
      rect: { x: number; y: number }[];
      order: number;
      isVisible: boolean;
    }[] = [];
    for (let i = 0; i < 500; i++) {
      let tmpOneLabel = { ...oneLabel };
      tmpOneLabel.id = i + 'dfsfsdf';
      tmpOneLabel.order = i;

      let translate = Math.random() * 10 - 5;
      let angle = Math.random() * 365;

      tmpOneLabel.rect[0].x = tmpOneLabel.rect[0].x + translate;
      tmpOneLabel.rect[0].y = tmpOneLabel.rect[0].y + translate;
      tmpOneLabel.rect[1].x = tmpOneLabel.rect[1].x + translate;
      tmpOneLabel.rect[1].y = tmpOneLabel.rect[1].y + translate;
      tmpOneLabel.rect[2].x = tmpOneLabel.rect[2].x + translate;
      tmpOneLabel.rect[2].y = tmpOneLabel.rect[2].y + translate;
      tmpOneLabel.rect[3].x = tmpOneLabel.rect[3].x + translate;
      tmpOneLabel.rect[3].y = tmpOneLabel.rect[3].y + translate;

      tmpOneLabel.rect = tmpOneLabel.rect.map(point => {
        return AxisUtils.getRotatePoint({ x: 0, y: 0 }, point, angle);
      });

      rsult.push(tmpOneLabel);
    }

    let fList: any[] = cloudMockFileList.map((item, i) => ({
      id: i + 1,
      url: item.url,
      mappingImgList: item.mappingImgList,
      result: JSON.stringify({
        pointCloudTool: {
          toolName: 'pointCloudTool',
          result: rsult
        }
      })
    }));
    setFileList(fList);
  }, []);

  const goBack = (data: any) => {
    console.log('goBack', data);
  };
  return (
    <>
      {fileList && fileList.length > 0 && tools && tools.length > 0 && (
        <Annotation
          attribute={attribute}
          tagList={[]}
          fileList={fileList}
          textConfig={[]}
          goBack={goBack}
          tools={tools}
        />
      )}
    </>
  );
};

export default AnnotationPage;
