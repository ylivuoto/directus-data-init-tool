'use strict';

import {describe, expect, test} from '@jest/globals';
import { retrieveConfig } from './src/lib/retrieve';

const users = [
    {
	id: "00e3e00d-4fc5-4d01-8bf4-858ba513fc5a"
    },
    {
	id: "9ecc2969-8b38-4088-9dc1-78334a206445"
    },
];

// Corresponding data in users.json
// [
//     {
//         "id": "00e3e00d-4fc5-4d01-8bf4-858ba513fc5a",
//         "users": null
//     },
//     {
//         "id": "9ecc2969-8b38-4088-9dc1-78334a206445",
//         "users": [
//             "2803d7ac-a679-4e26-896b-c4d6f5b9a312"
//         ]
//     }
// ]

const operations = [
    {
        "reject": null,
        "resolve": null,
        "id": "0c42acb8-deac-4d5b-811d-2c0254e13935",
    },
    {
        "reject": null,
        "resolve": null,
        "id": "0c42acb8-deac-4d5b-811d-2c0254e13935",
    },
    {
        "reject": null,
        "resolve": null,
        "id": "0c42acb8-deac-4d5b-811d-2c0254e13935",
    }
];

// Data in operations.json
// [
//     {
//         "reject": "2b35f987-80ab-4ada-a8ad-227e6759af1c",
//         "resolve": "86591560-fe59-48ff-9821-e6994de36759",
//         "id": "0c42acb8-deac-4d5b-811d-2c0254e13935"
//     },
//     {
//         "reject": "2b35f987-80ab-4ada-a8ad-227e6759af1c",
//         "resolve": "86591560-fe59-48ff-9821-e6994de36759",
//         "id": "0c42acb8-deac-4d5b-811d-2c0254e13935"
//     },
//     {
//         "reject": "2b35f987-80ab-4ada-a8ad-227e6759af1c",
//         "resolve": "86591560-fe59-48ff-9821-e6994de36759",
//         "id": "0c42acb8-deac-4d5b-811d-2c0254e13935"
//     }
// ]

const presets = [
    {
        "user": null,
        "id": 1
    },
    {
        "user": null,
        "id": 2
    },
    {
        "user": null,
        "id": 3
    }
];

// Data in presets.json
// [
//     {
//         "user": "2803d7ac-a679-4e26-896b-c4d6f5b9a312",
//         "id": 1
//     },
//     {
//         "user": "2803d7ac-a679-4e26-896b-c4d6f5b9a312",
//         "id": 2
//     },
//     {
//         "user": "2803d7ac-a679-4e26-896b-c4d6f5b9a312",
//         "id": 3
//     }
// ]


const flows = [
    {
        "id": "0f8ea882-219d-4823-bb80-bc725d280c3a"
    },
    {
        "id": "0f8ea882-219d-4823-bb80-bc725d280c3a"
    },
    {
        "id": "0f8ea882-219d-4823-bb80-bc725d280c3a"
    }
];


// in flows.json
// [
//     {
//         "id": "0f8ea882-219d-4823-bb80-bc725d280c3a",
//         "operations": [
//             "da0bd4ed-f886-4bcb-9a61-f0cb3f7952bd"
//         ]
//     },
//     {
//         "id": "0f8ea882-219d-4823-bb80-bc725d280c3a",
//         "operations": [
//             "391b980c-a792-4343-8da6-33f9774d7d39",
//             "40fd454c-a438-47bb-9bc5-399d1fffd562",
// 	    ]
//     },
//     {
//         "id": "0f8ea882-219d-4823-bb80-bc725d280c3a",
//         "operations": [
//             "9ae6d868-d5ef-44f5-8aa5-cd01cd726902",
//         ]
//     }
// ]




describe('Retrieve.js lib module', () => {
    test('retrieveConfig() for users', () => {
	expect(retrieveConfig('./testdata', 'user')).toEqual(users);
    });

    test('retrieveConfig() for operations', () => {
	expect(retrieveConfig('./testdata', 'operations')).toEqual(operations);
    });

    test('retrieveConfig() for presets', () => {
	    expect(retrieveConfig('./testdata', 'presets')).toEqual(presets);
    });

    test('retrieveConfig() for flows', () => {
	    expect(retrieveConfig('./testdata', 'flows')).toEqual(flows);
    });
});
