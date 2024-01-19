import React from 'react';
import styled from 'styled-components';

import { BlockPicker } from 'react-color';

import { Relative, Absolute, Clickable, Card, Flex, Text } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';
import { useListener, useClickOutside } from '/src/libs/hooks';

const Wrap = styled(Card)`
    position: relative;
`;

const Knob = ({ selected, color, onClick, text, children, ...props }: any) => {
    return (
        <Relative {...props}>
            <Clickable
                w="24px" 
                h="24px" 
                background={color} 
                radius="32px" 
                style={{ border: selected ? '3px solid #333333' : 'none' }}
                onClick={onClick}
            >
                {children}
            </Clickable>

            {text && (
                <Absolute bottom="-2px" right="-2px" style={{ zIndex: 10, pointerEvents: 'none' }}>
                    <Card
                        w="16px" 
                        h="16px" 
                        background={colors.text} 
                        radius="32px" 
                    >
                        <Flex w="100%" h="100%">
                            <Text size="14px" color={colors.white} weight="800">{text}</Text>
                        </Flex>
                    </Card>
                </Absolute>
            )}            
        </Relative>
    );
};

const ColorKnob = ({ selected, color, onChangeColor, onSelect, text }) => {
    const [visible, setVisible] = React.useState(false);
    const show = React.useCallback(() => setVisible(true), [setVisible]);
    const hide = React.useCallback(() => setVisible(false), [setVisible]);

    return (
        <Relative ref={useClickOutside(hide)}>
            <Knob selected={selected} color={color} text={text} onClick={() => {show(); onSelect(); }} />

            {visible && (
                <Absolute top="-235px" left="-60px">
                    <Card style={{ boxShadow: '0 0 4px 0 rgba(0,0,0,.2)'}}>
                        <BlockPicker color={color} onChange={({ hex }) => onChangeColor(hex)} triangle={'hide'} />
                    </Card>
                </Absolute>
            )}
        </Relative>
    );
};

export const Brush = ({ onChangeColor, ...props }) => {
    const [brushColors, setBrushColors] = React.useState(['#ff0000']);

    const setBrushColor = React.useCallback((index: number, color: string) => 
        setBrushColors(($) => $.map(($$, j) => index === j ? color : $$))
    , [setBrushColors]);

    const [selected, setSelected] = React.useState(0 as number | 'erase');

    useListener(window, 'keydown', (e) => {
        const offset = (e as any).keyCode - 49;

        if (offset > -1 && offset < 10) {
            if (brushColors[offset]) {
                setSelected(offset);
            }
        }

        if ((e as any).code === 'KeyE') {
            setSelected('erase');
        }
    }, [setSelected, brushColors]);

    React.useEffect(() => {
        if (selected === 'erase') {
            onChangeColor(null);
        } else {
            onChangeColor(brushColors[selected]);
        }
        
    }, [brushColors, selected]);

    const add = React.useCallback(() => {
        setBrushColors(($) => $.concat(['#bbbbbb']));
    }, [setBrushColors]);

    return (
        <Wrap {...props} radius="4px" background={colors.dd}>
            <Flex gap="4px" p="10px 12px">
                {brushColors.map((color, index) => (
                    <ColorKnob onSelect={() => setSelected(index)} selected={selected === index} key={index} color={color} text={index + 1} onChangeColor={($) => setBrushColor(index, $)} />
                ))}

                <Knob onClick={add} color="#bbb" text="" selected={false}>
                    <Flex w="100%" h="100%">
                        <Text size="24px">+</Text>
                    </Flex>
                </Knob>

                <Knob ml="24px" onClick={() => setSelected('erase')} color="#bbb" text="E" selected={selected === 'erase'} />
            </Flex>
        </Wrap>
    );
};
