export const getMainPath = () => '/main'
export const getOrdersPath = () => '/orders'
export const getOrderDetailsPath = (orderId: number | string = ':orderId') =>
    `/order/order-details/${orderId}`

export const getSalesPath = (dateStart?: string, dateEnd?: string) => {
    if (dateStart && dateEnd) {
        return `/sales?date_start=${dateStart}&date_end=${dateEnd}`
    }
    return '/sales'
}

export const getSaleDetailPath = (
    saleId: number | string = ':saleId',
    dateStart?: string,
    dateEnd?: string,
) => {
    if (dateStart && dateEnd) {
        return `/sale/${saleId}?date_start=${dateStart}&date_end=${dateEnd}`
    }
    return `/sale/${saleId}`
}

// export const getSalesPath = () => '/sales'
// export const getSaleDetailPath = (saleId: number | string = ':saleId') => `/sale/${saleId}`

export const getProfilePath = () => '/profile'

export const getPaymentsPath = () => '/payments'
export const getPayoutsPath = () => '/payouts'
export const getDebtPath = () => '/debt'
export const getReconciliationActPath = () => '/reconciliation-act'
export const getDeliveryAddressPath = () => '/delivery-address'
export const getDeliveryAddressMapPath = (
    addressId: number | string = ':addressId',
) => `/delivery-address/${addressId}`
export const getBasketPath = () => '/basket'
export const getCategoryPath = (categoryId: string = ':categoryId') =>
    `/category/${categoryId}`
export const getCheckoutPath = () => '/checkout'
export const getProductPath = (productId: number | string = ':productId') =>
    `/product/${productId}`

export const getTaskPath = () => '/task'
export const getDocumentPath = () => '/document'
export const getIncomingDocumentsPath = () => '/document/incoming'
export const getOutgoingDocumentsPath = () => '/document/outgoing'
export const getDraftDocumentsPath = () => '/document/draft'
export const getApprovalDocumentPath = () => '/approval-document'

export const getDocumentGroupListPath = () => `/document-group`
export const getContractorPath = () => `/contractor`
export const getOrganizationUnitPath = () => '/organization-unit'
export const getOrganizationUserPath = () => '/organization-user'

export const getContractorsContractPath = (
    contractorId: number | string = ':contractorId',
) => `/contractor/${contractorId}/contracts`

export const getActCreatePath = () => `/document/act/create`
export const getActUpdatePath = (actId: number | string = ':actId') =>
    `/document/act/${actId}/edit`
export const getActViewPath = (actId: number | string = ':actId') =>
    `/document/act/${actId}`

export const getContractCreatePath = () => `/document/contract/create`
export const getContractUpdatePath = (
    contractId: number | string = ':contractId',
) => `/document/contract/${contractId}/edit`
export const getContractViewPath = (
    contractId: number | string = ':contractId',
) => `/document/contract/${contractId}`

export const getEmpowermentCreatePath = () => `/document/empowerment/create`
export const getEmpowermentUpdatePath = (
    empowermentId: number | string = ':empowermentId',
) => `/document/empowerment/${empowermentId}/edit`
export const getEmpowermentViewPath = (
    empowermentId: number | string = ':empowermentId',
) => `/document/empowerment/${empowermentId}`

export const getInvoiceCreatePath = () => `/document/invoice/create`
export const getInvoiceUpdatePath = (
    invoiceId: number | string = ':invoiceId',
) => `/document/invoice/${invoiceId}/edit`
export const getInvoiceViewPath = (invoiceId: number | string = ':invoiceId') =>
    `/document/invoice/${invoiceId}`

export const getVerificationActCreatePath = () =>
    `/document/verification-act/create`
export const getVerificationActUpdatePath = (
    verificationActId: number | string = ':verificationActId',
) => `/document/verification-act/${verificationActId}/edit`
export const getVerificationActViewPath = (
    verificationActId: number | string = ':verificationActId',
) => `/document/verification-act/${verificationActId}`

export const getWaybillCreatePath = () => `/document/waybill/create`
export const getWaybillUpdatePath = (
    waybillId: number | string = ':waybillId',
) => `/document/waybill/${waybillId}/edit`
export const getWaybillViewPath = (waybillId: number | string = ':waybillId') =>
    `/document/waybill/${waybillId}`

export const getFreeFormDocumentCreatePath = () => `/document/free-form/create`
export const getFreeFormDocumentUpdatePath = (
    freeFormDocumentId: number | string = ':freeFormDocumentId',
) => `/document/free-form/${freeFormDocumentId}/edit`
export const getFreeFormDocumentViewPath = (
    freeFormDocumentId: number | string = ':freeFormDocumentId',
) => `/document/free-form/${freeFormDocumentId}`
