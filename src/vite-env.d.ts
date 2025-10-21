/// <reference types="vite/client" />

// PaymentsPage
// path url: /get-payments
// filter prams: {date_start: 2025-10-21, date_end: 2025-10-21}
// response: [
//     {
//         "id": "68f620c259659f92796a77a6",
//         "created_at": "2025-10-20 16:45:06",
//         "updated_at": "2025-10-20 16:45:06",
//         "is_deleted": false,
//         "deleted_at": null,
//         "organization_id": "6863d268683c613127a1e375",
//         "contractor": {
//             "id": "68e4f658f7952d5005a8a602",
//             "name": "Diyorbek"
//         },
//         "date": "2025-10-20 00:00:00",
//         "notes": null,
//         "debt_states": [
//             {
//                 "amount": 194000,
//                 "currency": {
//                     "id": 831,
//                     "is_national": true,
//                     "name": "UZS"
//                 }
//             }
//         ],
//         "cash_box_states": [
//             {
//                 "amount": 194000,
//                 "currency": {
//                     "id": 831,
//                     "is_national": true,
//                     "name": "UZS"
//                 },
//                 "payment_type": 1
//             }
//         ],
//         "sale": {
//             "id": "68f620c20812339653dc14d7"
//         },
//         "return": null,
//         "payment_source": 1,
//         "cash_box": {
//             "id": "686fb673ef0bd68a353c85f4",
//             "name": "Kassa"
//         }
//     }
// ]

// // show
// path url: /get-payment/${id}
// response: {
//     "id": "68f620c259659f92796a77a6",
//     "created_at": "2025-10-20 16:45:06",
//     "updated_at": "2025-10-20 16:45:06",
//     "is_deleted": false,
//     "deleted_at": null,
//     "organization_id": "6863d268683c613127a1e375",
//     "contractor": {
//         "id": "68e4f658f7952d5005a8a602",
//         "name": "Diyorbek"
//     },
//     "date": "2025-10-20 00:00:00",
//     "notes": null,
//     "debt_states": [
//         {
//             "amount": 194000,
//             "currency": {
//                 "id": 831,
//                 "is_national": true,
//                 "name": "UZS"
//             }
//         }
//     ],
//     "cash_box_states": [
//         {
//             "amount": 194000,
//             "currency": {
//                 "id": 831,
//                 "is_national": true,
//                 "name": "UZS"
//             },
//             "payment_type": 1
//         }
//     ],
//     "sale": {
//         "id": "68f620c20812339653dc14d7"
//     },
//     "return": null,
//     "payment_source": 1,
//     "cash_box": {
//         "id": "686fb673ef0bd68a353c85f4",
//         "name": "Kassa"
//     }
// }

// har bir kardni bosganda aynan shu cardbottom sheet ochilganda
