import {HTMLProps, useEffect, useState} from 'react'

type Props = HTMLProps<HTMLImageElement> & {
	file: Blob
}

const ReactiveImage = ({file, ...props}: Props) => {
	const [data, setData] = useState<string | null>(null)

	useEffect(() => {
		const reader = new FileReader()
		reader.onload = (e) => {
			setData(e.target?.result as string)
		}
		reader.readAsDataURL(file)
	}, [file])

	// @ts-ignore
	return data ? <img src={data} {...props}/> : null
}

export default ReactiveImage