import React from 'react';
import styled from 'styled-components';

import { Relative, Absolute, Clickable, Card, Flex, Text } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';

const Wrap = styled(Card)`
    position: relative;
`;

const Knob = ({ selected, color, onClick, text, ...props }: any) => {
    return (
        <Relative {...props}>
            <Clickable
                w="24px" 
                h="24px" 
                background={color} 
                radius="32px" 
                style={{ border: selected ? '2px solid #333333' : 'none' }}
                onClick={onClick}
            />

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

export const Brush = ({ ...props }) => {
    const COLORS = [
        '#ff0000',
        '#ffff00',
    ];

    const [selected, setSelected] = React.useState(1);

    return (
        <Wrap {...props} radius="4px" background={colors.dd}>
            <Flex gap="4px" p="12px">
                {COLORS.map((color, index) => (
                    <Knob selected={selected === index} key={index} color={color} text={index + 1} onClick={() => setSelected(index)} />
                ))}

                <Knob selected={false} color="#bbb" />
            </Flex>
        </Wrap>
    );
};
