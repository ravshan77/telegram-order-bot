import React from 'react';
import { CommonProps } from '@/@types/common'
import { Tag } from '@/shared/ui/kit'
import classNames from '@/shared/lib/classNames'

type SignStampProps = CommonProps & {
    certificateSerialNumber: string;
    signer: string;
    signingTime: string;
    statusText: string;
};

export const SignStamp = (props: SignStampProps) => {
    const {certificateSerialNumber, signer, statusText, signingTime, className} = props;

    return (
        <Tag className={classNames(className)}>
            <div className="w-full flex flex-col gap-3">
                <div className="w-full flex justify-between flex-wrap gap-3">
                    <h6>№ {certificateSerialNumber}</h6>
                    <h6>{signingTime}</h6>
                </div>
                <h3 className="text-center text-wrap">{statusText}</h3>
                <h6 className="uppercase text-wrap">{signer}</h6>
            </div>
        </Tag>
    )
};
