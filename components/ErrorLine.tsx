type Props = {
	error: string | undefined
}

const ErrorLine = ({error}: Props) => !error ? null : (
	<p className="bg-red-500 max-w-max px-2 border border-gray-300">
		{error}
	</p>
)

export default ErrorLine