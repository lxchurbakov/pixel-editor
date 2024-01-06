import React from 'react';
import styled from 'styled-components';

import { Card, Flex, Base, Clickable } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';

const Wrap = styled(Card)`
    position: relative;
`;

const Selection = styled(Card).attrs({
    background: colors.f0,
    radius: '4px',
})<{ index: number }>`
    position: absolute;
    z-index: 2;
    top: 6px;
    width: 36px;
    height: 36px;
    left: ${props => Math.max(0, props.index * (24 + 12)) + 6}px;
    transition: left 100ms ease;
`;

export const Selector = ({ mode, onChange, modes, ...props }) => {
    const selection = React.useMemo(() => modes.findIndex(($) => $.name === mode), [mode, modes]);

    return (
        <Wrap {...props} radius="4px" background={colors.dd}>
            <Selection index={selection} />

            <Flex gap="12px" p="0 12px" style={{ position: 'relative', zIndex: 3 }}>
                {modes.map((mode) => (
                    <Base p="12px 0" key={mode.name}>
                        <Clickable onClick={() => onChange(mode.name)}>
                            <mode.icon size={24} color={colors.text} />
                        </Clickable>
                    </Base>
                ))}
            </Flex>
        </Wrap>
    );
};