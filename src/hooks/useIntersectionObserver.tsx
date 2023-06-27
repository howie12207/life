import { RefObject, useEffect, useState } from 'react';

interface Args extends IntersectionObserverInit {
    freezeOnceVisible?: boolean;
}

type Response = {
    entry: IntersectionObserverEntry | undefined;
    inView: boolean | undefined;
};

function useIntersectionObserver(
    elementRef: RefObject<Element>,
    { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = {} as Args
): Response {
    const [entry, setEntry] = useState<IntersectionObserverEntry>();
    const inView = entry?.isIntersecting;

    const frozen = inView && freezeOnceVisible;

    const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
        setEntry(entry);
    };

    useEffect(() => {
        const node = elementRef?.current; // DOM Ref
        const hasIOSupport = !!window.IntersectionObserver;

        if (!hasIOSupport || frozen || !node) return;

        const observerParams = { threshold, root, rootMargin };
        const observer = new IntersectionObserver(updateEntry, observerParams);

        observer.observe(node);

        return () => observer.disconnect();
    }, [elementRef, root, rootMargin, frozen, threshold]);

    return { entry, inView };
}

export default useIntersectionObserver;
