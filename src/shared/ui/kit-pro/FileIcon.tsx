import { FileDocSvg, FileFigmaSvg, FileImageSvg, FilePdfSvg, FilePptSvg, FileXlsSvg, FolderSvg } from '@/shared/ui/svg'
import { LuFileText } from 'react-icons/lu'

export const FileIcon = ({ type, size = 40 }: { type: string; size?: number }) => {
    switch (type) {
        case 'pdf':
        case 'pdfa':
            return <FilePdfSvg height={size} width={size} />
        case 'csv':
        case 'xls':
        case 'xlsx':
            return <FileXlsSvg height={size} width={size} />
        case 'doc':
        case 'docx':
            return <FileDocSvg height={size} width={size} />
        case 'ppt':
        case 'pptx':
            return <FilePptSvg height={size} width={size} />
        case 'figma':
            return <FileFigmaSvg height={size} width={size} />
        case 'gif':
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'webp':
            return <FileImageSvg height={size} width={size} />
        case 'directory':
            return <FolderSvg height={size} width={size} />
        default:
            return <LuFileText size={"40px"}  />
    }
}
