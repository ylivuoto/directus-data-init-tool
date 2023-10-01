'use strict';

import {describe, expect, test} from '@jest/globals';
import { retrieveConfig } from './src/lib/retrieve';

let res = [
    {
        users: null
    },
    {
        users: null
    },
];


describe('Retrieve.js lib module', () => {
    test('retrieveConfig() -function', () => {
	expect(retrieveConfig('./testdata', 'user')).toEqual(res);
    });
});
