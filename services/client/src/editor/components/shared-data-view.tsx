import React from 'react';
import styled from 'styled-components';

import { Card, BaseProps, Text } from 'libs/atoms';
import { colors } from 'libs/theme';

const Wrap = styled(Card)`
    position: relative;
`;

export const SharedDataView = ({ ...props }: BaseProps) => {
    return (
        <Wrap radius="4px" background={colors.dd} {...props}>
            <Text size="14px" p="14px 12px">No connection</Text>
        </Wrap>
    );
};
