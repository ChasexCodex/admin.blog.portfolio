import {HTMLProps, ReactNode} from 'react'

type Props = HTMLProps<HTMLLabelElement> & {
	text: ReactNode
}

const InputLabel = ({children, text, ...props}: Props) => {
	return (
		<div>
			<label {...props}>{text}</label>
			{children}
		</div>
	)
}

export default InputLabel