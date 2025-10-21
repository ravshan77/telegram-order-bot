/// <reference types="vite/client" />

// PayoutsPage
// path url: /get-payouts
// filter prams: {date_start: 2025-10-17, date_end: 2025-10-17}
// response: [ {
//         "id": "68f2517d59659f92796a7798",
//         "created_at": "2025-10-17 19:23:57",
//         "updated_at": "2025-10-17 19:23:57",
//         "is_deleted": false,
//         "deleted_at": null,
//         "organization_id": "6863d268683c613127a1e375",
//         "contractor": {
//             "id": "68e4f658f7952d5005a8a602",
//             "name": "Diyorbek"
//         },
//         "date": "2025-10-17 19:23:24",
//         "notes": "",
//         "debt_states": [
//             {
//                 "amount": 154000,
//                 "currency": {
//                     "id": 831,
//                     "is_national": true,
//                     "name": "UZS"
//                 }
//             }
//         ],
//         "cash_box_states": [
//             {
//                 "amount": 154000,
//                 "currency": {
//                     "id": 831,
//                     "is_national": true,
//                     "name": "UZS"
//                 },
//                 "payment_type": 1
//             }
//         ],
//         "purchase": null,
//         "refund": {
//             "id": "68f2516b0812339653dc1094"
//         },
//         "payout_source": 2,
//         "cash_box": {
//             "id": "686fb673ef0bd68a353c85f4",
//             "name": "Kassa"
//         }
//     },
//     {
//         "id": "68f20cdbdac2e00b5dd14697",
//         "created_at": "2025-10-17 14:31:07",
//         "updated_at": "2025-10-17 14:31:07",
//         "is_deleted": false,
//         "deleted_at": null,
//         "organization_id": "6863d268683c613127a1e375",
//         "contractor": {
//             "id": "68e4f658f7952d5005a8a602",
//             "name": "Diyorbek"
//         },
//         "date": "2025-10-17 14:31:00",
//         "notes": "",
//         "debt_states": [
//             {
//                 "amount": 59000,
//                 "currency": {
//                     "id": 831,
//                     "is_national": true,
//                     "name": "UZS"
//                 }
//             }
//         ],
//         "cash_box_states": [
//             {
//                 "amount": 59000,
//                 "currency": {
//                     "id": 831,
//                     "is_national": true,
//                     "name": "UZS"
//                 },
//                 "payment_type": 1
//             }
//         ],
//         "purchase": null,
//         "refund": {
//             "id": "68f20cd70812339653dc1090"
//         },
//         "payout_source": 2,
//         "cash_box": {
//             "id": "686fb673ef0bd68a353c85f4",
//             "name": "Kassa"
//         }
//     },
//     {
//         "id": "68f20cbcdac2e00b5dd14692",
//         "created_at": "2025-10-17 14:30:36",
//         "updated_at": "2025-10-17 14:30:36",
//         "is_deleted": false,
//         "deleted_at": null,
//         "organization_id": "6863d268683c613127a1e375",
//         "contractor": {
//             "id": "68e4f658f7952d5005a8a602",
//             "name": "Diyorbek"
//         },
//         "date": "2025-10-17 14:30:15",
//         "notes": "",
//         "debt_states": [
//             {
//                 "amount": 45000,
//                 "currency": {
//                     "id": 831,
//                     "is_national": true,
//                     "name": "UZS"
//                 }
//             }
//         ],
//         "cash_box_states": [
//             {
//                 "amount": 45000,
//                 "currency": {
//                     "id": 831,
//                     "is_national": true,
//                     "name": "UZS"
//                 },
//                 "payment_type": 1
//             }
//         ],
//         "purchase": {
//             "id": "68f20cad0812339653dc108e"
//         },
//         "refund": null,
//         "payout_source": 1,
//         "cash_box": {
//             "id": "686fb673ef0bd68a353c85f4",
//             "name": "Kassa"
//         }
//     }
// ]

// // show
// path url: /get-payout/${id}
// response: {
//     "id": "68f2517d59659f92796a7798",
//     "created_at": "2025-10-17 19:23:57",
//     "updated_at": "2025-10-17 19:23:57",
//     "is_deleted": false,
//     "deleted_at": null,
//     "organization_id": "6863d268683c613127a1e375",
//     "contractor": {
//         "id": "68e4f658f7952d5005a8a602",
//         "name": "Diyorbek"
//     },
//     "date": "2025-10-17 19:23:24",
//     "notes": "",
//     "debt_states": [
//         {
//             "amount": 154000,
//             "currency": {
//                 "id": 831,
//                 "is_national": true,
//                 "name": "UZS"
//             }
//         }
//     ],
//     "cash_box_states": [
//         {
//             "amount": 154000,
//             "currency": {
//                 "id": 831,
//                 "is_national": true,
//                 "name": "UZS"
//             },
//             "payment_type": 1
//         }
//     ],
//     "purchase": null,
//     "refund": {
//         "id": "68f2516b0812339653dc1094"
//     },
//     "payout_source": 2,
//     "cash_box": {
//         "id": "686fb673ef0bd68a353c85f4",
//         "name": "Kassa"
//     }
// }
