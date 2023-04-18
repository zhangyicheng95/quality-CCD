import { useCallback, useMemo, useState } from "react";

type EyeDropper = {
    open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string | undefined }>;
};

export default function useEyeDropper(
    init?: string,
): [
        state: { canUse: boolean; color: string },
        action: (signal?: AbortSignal | undefined) => Promise<string | undefined>,
    ] {
    const canUse = useMemo(function () {
        return Object.prototype.hasOwnProperty.call(window, 'EyeDropper');
    }, []);
    const [color, setColor] = useState(init ?? '');

    const open = useCallback(
        async function (signal?: AbortSignal) {
            if (!canUse) return;
            let res: any = null;
            try {
                const eyeDropper: EyeDropper = new (window as any).EyeDropper();
                if (!eyeDropper) return '';
                res = await eyeDropper.open({ signal });
                res.sRGBHex && setColor(res.sRGBHex);
            } catch (err) {
                console.error(err);
            }
            return !!res ? res.sRGBHex : '';
        },
        [canUse],
    );

    return [{ canUse, color }, open];
};
