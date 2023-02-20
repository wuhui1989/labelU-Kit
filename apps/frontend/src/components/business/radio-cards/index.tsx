import type { FC } from 'react';
import type { RadioGroupProps } from 'antd';
import { css } from '@emotion/react';

import MyRadio from '@/components/basic/radio';

export interface MyRadioCardssOption {
  label: React.ReactNode;
  value: string | number;
}

export interface MyRadioCardsProps extends RadioGroupProps {
  options: MyRadioCardssOption[];
}

const styles = css`
  padding: 8px;
  background-color: #ffffff;
  .ant-radio-group {
    width: 100%;
    display: flex;
  }
  .ant-radio-button-wrapper {
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .ant-radio-button {
  }
`;

const MyRadioCards: FC<MyRadioCardsProps> = (props) => {
  const { options, ...rest } = props;
  return (
    // eslint-disable-next-line react/no-unknown-property
    <div css={styles}>
      <MyRadio.Group buttonStyle="solid" {...rest}>
        {options?.map((option) => (
          <MyRadio.Button style={{ width: `calc(100% / ${options.length})` }} key={option.value} value={option.value}>
            {option.label}
          </MyRadio.Button>
        ))}
      </MyRadio.Group>
    </div>
  );
};

export default MyRadioCards;