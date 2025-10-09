export const BoxSvg = ({
    height = 100,
    width = 100,
}: {
    height?: number | string
    width?: number | string
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M8.00012 14L2 11.3333L2 4.66665M8.00012 14L14.0001 11.3333L14.0002 4.66671M8.00012 14V7.33333M14.0002 4.66671L8.00012 7.33333M14.0002 4.66671L11.0001 3.33336M2 4.66665L8.00012 2L11.0001 3.33336M2 4.66665L5.00006 5.99999M8.00012 7.33333L5.00006 5.99999M5.00006 5.99999L11.0001 3.33336"
                stroke="#99A1AF"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
