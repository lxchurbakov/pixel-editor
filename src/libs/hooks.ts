import React from 'react';

export const useListener = (target: any, event: string, callback: EventListenerOrEventListenerObject, deps: React.DependencyList, options?: any) => {
    React.useEffect(() => {
        target.addEventListener(event, callback, options);
        return () => target.removeEventListener(event, callback);
    }, [...deps, callback]);
};

export const useClickOutside = (predicate) => {
    const ref = React.useRef(null);

    useListener(window, 'click', (e) => {
        if (!ref.current?.contains(e.target)) {
            predicate();
        }
    }, [predicate]);

    return ref;
};
