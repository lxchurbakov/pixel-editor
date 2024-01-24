import React from 'react';
import styled from 'styled-components';

import { Clickable, Flex, Card, BaseProps, Text, Relative, Base } from 'libs/atoms';
import { colors } from 'libs/theme';

import { Drag as DragIcon } from '@styled-icons/fluentui-system-filled/Drag';
import { Paint } from '@styled-icons/boxicons-regular/Paint';

import Canvas from './plugins/canvas';
import Events from './plugins/events';

import Modes from './plugins/modes';

import Draw from './plugins/draw';
import Drag from './plugins/drag';

import { Selector } from './components/selector';
import { Brush } from './components/brush';

const Positioned = styled(Flex)`
    position: fixed;
    bottom: 64px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 200;
`;

const MODES = [
    { name: 'move', icon: DragIcon },
    { name: 'draw', icon: Paint },
];

export const Editor = ({ ...props }: {} & BaseProps) => {
    const rootRef = React.useRef(null);
    const plugRef = React.useRef({} as any);

    const [mode, setMode] = React.useState('draw');

    React.useEffect(() => {
        const root = rootRef.current;

        const canvas = new Canvas(root);
        const events = new Events(root);

        const modes = new Modes();

        const drag = new Drag(canvas, events, modes);
        const draw = new Draw(events, modes, drag);

        plugRef.current = { modes, draw };
    }, []);
    
    React.useEffect(() => {
        plugRef.current.modes.onUpdate.subscribe(setMode);
    }, []);

    React.useEffect(() => {
        plugRef.current.modes.set(mode);        
    }, [mode]);

    const setPlugwareColor = React.useCallback((color: string) => {
        if (plugRef.current?.draw) {
            plugRef.current.draw.setColor(color);
        }
    }, []);

    return (
        <Relative {...props}>
            <Base w="100%" h="100%" ref={rootRef} style={{ overflow: 'hidden' }} />

            <Positioned gap="24px">
                <Selector modes={MODES} mode={mode} onChange={setMode} />
                <Brush onChangeColor={setPlugwareColor} />
            </Positioned>
        </Relative>
    );
};
