export const Events = {
	Contractor: {
		Add: "ContractorAdd",
	},
	ContractorsContract: {
		Add: "ContractorsContractAdd",
		Updated: "ContractorsContractUpdated",
	},
	User: {
		Login: "UserLogin",
		Register: "UserLogin",
	},
	OrganizationUser: {
		Added: "UserAdded",
		Deleted: "UserDeleted",
		Restored: "UserRestored",
		TypeChanged: "UserTypeChanged",
		PasswordChanged: "UserPasswordChanged",
	},
	Document: {
		Loaded: "DocumentLoaded",
		ChangedOrganizationUnit: "DocumentChangedOrganizationUnit",
		ChangedOrganizationUnitMany: "DocumentChangedOrganizationUnitMany",
		ChangedGroup: "DocumentChangedGroup",
		ChangedGroupMany: "DocumentChangedGroupMany",
		Sent: "DocumentSent",
		Accepted: "DocumentAccepted",
		Declined: "DocumentDeclined",
		Cancelled: "DocumentCancelled",
		Synced: "DocumentSynced",
		Created: "DocumentCreated",
		CreatedApprovalProcess: "CreatedApprovalProcess",
		AttachedFile: "DocumentAttachedFile",
		RenamedAttachmentFile: "DocumentRenamedAttachmentFile",
		DeletedAttachmentFile: "DocumentDeletedAttachmentFile",
		ApprovedApprovalProcess: "DocumentApproved",
		DeclinedApprovalProcess: "DocumentDeclined",
		CancelledApprovalProcess: "DocumentCancelled",
		DownloadedZipFile: "DocumentDownloadedZipFile",
		DownloadedPdfFile: "DocumentDownloadedPdfFile",
		DownloadedAttachmentFile: "DownloadedAttachmentFile",
		Deleted: "DeletedDocument",
		AttachedRelatedDocument: "DocumentAttachedRelatedDocument",
	},
    DocumentGroup: {
        Created: "DocumentGroupCreated",
        Deleted: "DocumentGroupDeleted",
        Updated: "DocumentGroupUpdated",
    },
} as const;

export interface EventPayloads {
	[Events.Contractor.Add]: {contractId: string};

	[Events.ContractorsContract.Add]: void;
	[Events.ContractorsContract.Updated]: void;

	[Events.User.Login]: void;
	[Events.User.Register]: void;

	[Events.OrganizationUser.Added]: void;
	[Events.OrganizationUser.Deleted]: void;
	[Events.OrganizationUser.Restored]: void;
	[Events.OrganizationUser.TypeChanged]: void;
	[Events.OrganizationUser.PasswordChanged]: void;

	[Events.Document.Loaded]: void;
	[Events.Document.ChangedOrganizationUnit]: void;
	[Events.Document.ChangedOrganizationUnitMany]: void;
	[Events.Document.ChangedGroup]: void;
	[Events.Document.ChangedGroupMany]: void;
	[Events.Document.Created]: void;
	[Events.Document.CreatedApprovalProcess]: void;
	[Events.Document.AttachedFile]: void;
	[Events.Document.RenamedAttachmentFile]: void;
	[Events.Document.DeletedAttachmentFile]: void;
	[Events.Document.ApprovedApprovalProcess]: void;
	[Events.Document.DeclinedApprovalProcess]: void;
	[Events.Document.CancelledApprovalProcess]: void;
    [Events.Document.Accepted]: void;
    [Events.Document.Cancelled]: void;
    [Events.Document.Declined]: void;
    [Events.Document.Sent]: void;
	[Events.Document.Synced]: void;

	[Events.Document.DownloadedZipFile]: void;
	[Events.Document.DownloadedPdfFile]: void;
	[Events.Document.DownloadedAttachmentFile]: void;
	[Events.Document.Deleted]: void;
	[Events.Document.AttachedRelatedDocument]: void;

    [Events.DocumentGroup.Created]: void;
    [Events.DocumentGroup.Deleted]: void;
    [Events.DocumentGroup.Updated]: void;
}
