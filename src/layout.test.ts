import { fileURLToPath } from 'node:url';

import { compile } from 'sass';
import { describe, expect, test } from 'vitest';

describe('Cockpit page layout', () => {
    test('provides a viewport-height root scroller', () => {
        const css = compile(fileURLToPath(new URL('./app.scss', import.meta.url)), {
            loadPaths: ['pkg/lib', 'node_modules'],
            quietDeps: true,
        }).css;

        expect(css).toMatch(/html,\s*body,\s*#app\s*{[^}]*block-size:\s*100%/s);
        expect(css).toMatch(/#app\s*{[^}]*overflow-y:\s*auto/s);
    });
});
