import React from 'react';
import styled from 'styled-components';

import { Clickable, Flex, Card, BaseProps, Text, Relative, Base } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';

import { Drag } from '@styled-icons/fluentui-system-filled/Drag';
import { Paint } from '@styled-icons/boxicons-regular/Paint';

const Wrap = styled(Card)`
    position: relative;
`;

const Selection = styled(Card).attrs({
    background: colors.f0,
    radius: '4px',
})<{ index: number }>`
    position: absolute;
    z-index: -1;
    top: 6px;
    width: 36px;
    height: 36px;
    left: ${props => Math.max(0, props.index * (24 + 12)) + 6}px;
    transition: left 100ms ease;
`;

const ModeSelector = ({ mode, onChange, modes, ...props }) => {
    const selection = React.useMemo(() => modes.findIndex(($) => $.name === mode), [mode, modes]);

    return (
        <Wrap {...props} radius="4px" background={colors.dd}>
            <Selection index={selection} />

            <Flex gap="12px" p="0 12px">
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

const PositionedModeSelector = styled(ModeSelector)`
    position: fixed;
    bottom: 64px;
    left: 50%;
    transform: translateX(-50%);
`;

const MODES = [
    { name: 'move', icon: Drag },
    { name: 'paint', icon: Paint },
];

export const Editor = ({ ...props }: {} & BaseProps) => {
    const [mode, setMode] = React.useState('move');

    return (
        <Relative {...props}>
            <PositionedModeSelector modes={MODES} mode={mode} onChange={setMode} />
        </Relative>
    );
};
