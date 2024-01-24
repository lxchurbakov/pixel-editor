import React from 'react';
import styled, { css } from 'styled-components';

import * as theme from './theme';

export type PropsOf<T> = T extends React.FC<infer P> ? P : never;

export type BaseProps = {
    p?: string;
    pt?: string;
    pl?: string;
    pr?: string;
    pb?: string;
    m?: string;
    mt?: string;
    mr?: string;
    mb?: string;
    ml?: string;
    w?: string;
    h?: string;
    mw?: string;
    mh?: string;
};

export const Base = styled.div<BaseProps>`
    padding: ${props => props.p};
    padding-top: ${props => props.pt};
    padding-right: ${props => props.pr};
    padding-left: ${props => props.pl};
    padding-bottom: ${props => props.pb};
    margin: ${props => props.m};
    margin-top: ${props => props.mt};
    margin-right: ${props => props.mr};
    margin-left: ${props => props.ml};
    margin-bottom: ${props => props.mb};
    width: ${props => props.w};
    height: ${props => props.h};
    max-width: ${props => props.mw};
    max-height: ${props => props.mh};

    box-sizing: border-box;
`;

export const Flex = styled(Base)<{
    dir?: 'row' | 'column';
    align?: 'center' | 'flex-start' | 'flex-end';
    justify?: 'center' | 'flex-start' | 'flex-end' | 'space-around' | 'space-between';
    isWrap?: boolean;
    gap?: string;
}>`
    display: flex;
    flex-direction: ${props => props.dir || 'row'};
    align-items: ${props => props.align || 'center'};
    justify-content: ${props => props.justify || 'center'};
    flex-wrap: ${props => props.isWrap ? 'wrap' : 'nowrap'};
    gap: ${props => props.gap || '0'};
`;

export const Text = styled(Base)<{ size?: string, weight?: string, color?: string, line?: string }>`
    font-family: Raleway, sans;
    font-size: ${props => props.size || '16px'};
    font-weight: ${props => props.weight || 400};
    color: ${props => props.color || theme.colors.text};
    line-height: ${props => props.line || '1.6'};
    text-align: ${props => props.align};
`;

export const Mono = styled(Text)`
    font-family: Monospace;
`;

export const Image = styled.img<BaseProps>`
    padding: ${props => props.p};
    padding-top: ${props => props.pt};
    padding-right: ${props => props.pr};
    padding-left: ${props => props.pl};
    padding-bottom: ${props => props.pb};
    margin: ${props => props.m};
    margin-top: ${props => props.mt};
    margin-right: ${props => props.mr};
    margin-left: ${props => props.ml};
    margin-bottom: ${props => props.mb};
    width: ${props => props.w};
    height: ${props => props.h};
    max-width: ${props => props.mw};
    max-height: ${props => props.mh};

    box-sizing: border-box;
    object-fit: cover;
`;

export const Card = styled(Base)<{ background?: string, border?: string, radius?: string, hideOverflow?: boolean, block?: boolean, shadow?: string }>`
    display: ${props => props.block ? 'block' : 'inline-block'};
    background: ${props => props.background || 'none'};
    border: ${props => props.border || 'none'};
    border-radius: ${props => props.radius || '0px'};
    overflow: ${props => props.hideOverflow ? 'hidden' : 'visible'};
    box-shadow: ${props => props.shadow || 'none'};
`;

export const Clickable = styled(Card)`
    cursor: pointer;
    user-select: none;
    position: relative;

    ${props => props.hover && css`
        &:hover {
            background: ${props.hover};
        }
    `};

    &:active {
        transform: translateY(1px);
        z-index: 2;
    }
`;

export const Container = ({ children, ...props }: { children: any } & PropsOf<typeof Flex>) => {
    return (
        <Flex {...props}>
            <Base w="100%" mw="1280px" p="0 20px">
                {children}
            </Base>
        </Flex>
    )
};

export const Disabled = styled(Base)<{ disabled: boolean }>`
    ${props => props.disabled && css`
        opacity: .5;
        pointer-events: none;
    `};
`;

export const Relative = styled(Base)`
    position: relative;
`;

export const Absolute = styled(Base)`
    position: absolute;
    top: ${props => props.top};
    left: ${props => props.left};
    right: ${props => props.right};
    bottom: ${props => props.bottom};
`;

export const Tag = ({ color, weight, size, children, ...props }: any) => {
    return (<Card p={props.p || '0px 8px'} radius={props.radius || '4px'} {...props}><Text {...{ size, weight, color }}>{children}</Text></Card>)
};
